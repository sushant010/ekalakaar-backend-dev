import Event from "../models/event.model.js";
import mongoose from "mongoose";

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  try {
    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
    } else {
      res.status(200).json(event);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEvent = async (req, res) => {
  const event = new Event(req.body);
  console.log('Received data:', req.body);

  try {
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  // Ensure req.body does not contain userId
  delete req.body.userId;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedEvent) {
      res.status(404).json({ error: "Event not found" });
    } else {
      res.status(200).json(updatedEvent);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      res.status(404).json({ error: "Event not found" });
    } else {
      res.json({ message: 'Event deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { deleteEvent, updateEvent, createEvent, getAllEvents , getEventById};
