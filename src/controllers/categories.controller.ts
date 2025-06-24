import { Request, Response } from "express";
import { CategoriesService } from "../services/categories.service";

export class CategoriesController {
  private categoriesService: CategoriesService;

  constructor() {
    this.categoriesService = new CategoriesService();
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoriesService.getAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }

  async getRootCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoriesService.getRootCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch root categories" });
    }
  }

  async getCategoryTree(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoriesService.getCategoryTree();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category tree" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoriesService.getById(id);

      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  }

  async getByLevel(req: Request, res: Response): Promise<void> {
    try {
      const level = parseInt(req.params.level);
      const categories = await this.categoriesService.getByLevel(level);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories by level" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const category = await this.categoriesService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Failed to create category" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoriesService.update(id, req.body);

      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Failed to update category" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.categoriesService.delete(id);

      if (!success) {
        res.status(404).json({ error: "Category not found" });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      if (error.message === "Cannot delete category with subcategories") {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to delete category" });
      }
    }
  }

  async getPopular(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const categories = await this.categoriesService.getPopularCategories(
        limit
      );
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular categories" });
    }
  }
}
