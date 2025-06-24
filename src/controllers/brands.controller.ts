import { Request, Response } from "express";
import { BrandsService } from "../services/brands.service";

export class BrandsController {
  private brandsService: BrandsService;

  constructor() {
    this.brandsService = new BrandsService();
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const brands = await this.brandsService.getAll();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const brand = await this.brandsService.getById(id);

      if (!brand) {
        res.status(404).json({ error: "Brand not found" });
        return;
      }

      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const brand = await this.brandsService.create(req.body);
      res.status(201).json(brand);
    } catch (error) {
      res.status(400).json({ error: "Failed to create brand" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const brand = await this.brandsService.update(id, req.body);

      if (!brand) {
        res.status(404).json({ error: "Brand not found" });
        return;
      }

      res.json(brand);
    } catch (error) {
      res.status(400).json({ error: "Failed to update brand" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.brandsService.delete(id);

      if (!success) {
        res.status(404).json({ error: "Brand not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete brand" });
    }
  }

  async getPopular(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const brands = await this.brandsService.getPopularBrands(limit);
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular brands" });
    }
  }
}
