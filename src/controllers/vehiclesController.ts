import { Request, Response } from 'express';
import { VehiclesService } from '../services/vehiclesService';

export class VehiclesController {
  private vehiclesService = new VehiclesService();

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { brand, priceMin, priceMax, location, page, limit } = req.query;
      const result = await this.vehiclesService.findAll({
        brand: brand as string,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        location: location as string,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  async getOne(req: Request, res: Response): Promise<void> {
    try {
      const vehicle = await this.vehiclesService.findOne(Number(req.params.id));
      res.json(vehicle);
    } catch (error: any) {
      res.status(error.message === 'Vehicle not found' ? 404 : 500).json({
        statusCode: error.message === 'Vehicle not found' ? 404 : 500,
        message: error.message,
      });
    }
  }

  async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const suggestions = await this.vehiclesService.getVehicleSuggestions(Number(req.params.id));
      res.json(suggestions);
    } catch (error: any) {
      res.status(error.message === 'Vehicle not found' ? 404 : 500).json({
        statusCode: error.message === 'Vehicle not found' ? 404 : 500,
        message: error.message,
      });
    }
  }

  async compare(req: Request, res: Response): Promise<void> {
    try {
      const ids = (req.query.ids as string).split(',').map(Number);
      const vehicles = await this.vehiclesService.compareVehicles(ids);
      res.json(vehicles);
    } catch (error: any) {
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.userId; 
      const vehicle = await this.vehiclesService.create({ ...req.body, userId });
      res.status(201).json(vehicle);
    } catch (error: any) {
      res.status(400).json({ statusCode: 400, message: error.message });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const { brand, model, priceMin, priceMax, location, mileageMax, color, condition, page, limit } = req.query;
      const result = await this.vehiclesService.search({
        brand: brand as string,
        model: model as string,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        location: location as string,
        mileageMax: mileageMax ? Number(mileageMax) : undefined,
        color: color as string,
        condition: condition as string,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  }
}