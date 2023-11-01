import express, { Request, Response } from "express";
export const Home = (req: Request, res: Response) => {
  res.sendFile("../../public/index.html");
};
