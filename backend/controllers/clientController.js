import Client from "../models/clientModel.js";
import { uploadToS3, deleteFromS3 } from "../utils/s3Upload.js";
import { getPaginationParams, getPaginationInfo } from "../utils/pagination.js";
import { makeSlug, getUniqueSlug } from "../utils/slugUtils.js";

const POPULATE_INDUSTRY = { path: "industry", select: "name slug" };

export const createClient = async (req, res) => {
    const { name, description, industry, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const order = req.body.order !== undefined ? Number(req.body.order) : 0;

    const baseSlug = makeSlug(name);
    const slug = await getUniqueSlug(Client, baseSlug);

    const coverImage = req.file ? await uploadToS3(req.file, "clients") : {};

    const client = await Client.create({
      name,
      slug,
      description,
      coverImage,
      industry: industry || null,
      order,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, data: client });
  
};

export const getClients = async (req, res) => {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { search } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [clients, totalDocs] = await Promise.all([
      Client.find(query)
        .populate(POPULATE_INDUSTRY)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Client.countDocuments(query),
    ]);

    const pagination = getPaginationInfo(totalDocs, page, limit);

    res.json({ success: true, data: clients, pagination });
 
};

export const getActiveClients = async (req, res) => {
    const clients = await Client.find({ isActive: true })
      .populate(POPULATE_INDUSTRY)
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: clients });
  
};

export const getClientById = async (req, res) => {
    const client = await Client.findById(req.params.id).populate(POPULATE_INDUSTRY);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.json({ success: true, data: client });
 
};

export const getClientBySlug = async (req, res) => {
    const client = await Client.findOne({ slug: req.params.slug }).populate(POPULATE_INDUSTRY);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }
    res.json({ success: true, data: client });
  
};

export const getClientsByIndustry = async (req, res) => {
    const clients = await Client.find({
      industry: req.params.industryId,
      isActive: true,
    })
      .populate(POPULATE_INDUSTRY)
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: clients });
 
};

export const updateClient = async (req, res) => {
    const { name, description, industry, order, isActive } = req.body;

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    client._previousIndustry = client.industry ?? null;
    client._previousOrder = client.order;

    if (req.file) {
      if (client.coverImage?.key) await deleteFromS3(client.coverImage.key);
      client.coverImage = await uploadToS3(req.file, "clients");
    }

    if (name !== undefined && name !== client.name) {
      client.name = name;
      const baseSlug = makeSlug(name);
      client.slug = await getUniqueSlug(Client, baseSlug, client._id);
    }

    if (description !== undefined) client.description = description;
    if (isActive !== undefined) client.isActive = isActive;

    if (industry !== undefined) client.industry = industry || null;

    if (order !== undefined) client.order = Number(order);

    await client.save();

    res.json({ success: true, data: client });
  
};

export const deleteClient = async (req, res) => {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    if (client.coverImage?.key) await deleteFromS3(client.coverImage.key);

    await client.deleteOne();

    res.json({ success: true, message: "Client deleted successfully" });
 
};