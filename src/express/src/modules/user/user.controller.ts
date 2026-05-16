import type { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, is_active, age, password } = req.body;
    const result = await userServices.createUserIntoDB({
      name,
      email,
      is_active,
      age,
      password,
    });

    res.status(201).send({
      message: "Created user successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Something went wrong",
    });
  }
};

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsersFromDB();
    res.status(200).send({
      message: "Fetched users successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Something went wrong",
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await userServices.getUserByIdFromDB(id);

    if (!result) {
      return res.status(404).send({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).send({
      message: "Fetched user successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Something went wrong",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name, email, is_active, age, password } = req.body;
    const result = await userServices.updateUserInDB(id, {
      name,
      email,
      is_active,
      age,
      password,
    });

    if (!result) {
      return res.status(404).send({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).send({
      message: "Updated user successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Something went wrong",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const result = await userServices.deleteUserFromDB(id);

    if (!result) {
      return res.status(404).send({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).send({
      message: "Deleted user successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Something went wrong",
    });
  }
};

export const userControllers = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};