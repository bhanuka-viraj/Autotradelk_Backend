import { AppDataSource } from "../config/database.config";
import { Vehicle } from "../entities/Vehicle";
import { Brand } from "../entities/Brand";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { Location } from "../entities/Location";
import { createServiceLogger } from "../utils/logger.util";

const logger = createServiceLogger("VehiclesSeed");

const vehicles = [
  {
    title: "2019 Toyota Camry LE",
    description:
      "Well-maintained Toyota Camry with low mileage. Perfect for daily commuting.",
    brandName: "toyota",
    categoryName: "Cars",
    model: "Camry",
    year: 2019,
    mileage: 45000,
    color: "Silver",
    condition: "Excellent",
    price: 25000,
    locationCode: "COL0101",
    status: "available",
    engineSize: "2.5L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "4T1B11HK5KU123456",
    registrationNumber: "ABC123",
    aftermarketParts: ["Tinted Windows", "Alloy Wheels"],
    missingParts: null,
    images: ["camry1.jpg", "camry2.jpg", "camry3.jpg"],
  },
  {
    title: "2020 Honda Civic EX",
    description:
      "Sporty Honda Civic with excellent fuel efficiency and modern features.",
    brandName: "honda",
    categoryName: "Cars",
    model: "Civic",
    year: 2020,
    mileage: 32000,
    color: "Blue",
    condition: "Excellent",
    price: 22000,
    locationCode: "COL0102",
    status: "available",
    engineSize: "1.5L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "19XFC2F89LE123456",
    registrationNumber: "XYZ789",
    aftermarketParts: ["LED Headlights", "Sport Exhaust"],
    missingParts: null,
    images: ["civic1.jpg", "civic2.jpg"],
  },
  {
    title: "2018 BMW 3 Series",
    description:
      "Luxury BMW 3 Series with premium features and excellent performance.",
    brandName: "bmw",
    categoryName: "Cars",
    model: "3 Series",
    year: 2018,
    mileage: 28000,
    color: "Black",
    condition: "Excellent",
    price: 35000,
    locationCode: "COL0103",
    status: "available",
    engineSize: "2.0L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "WBA8E9G50JNU12345",
    registrationNumber: "BMW001",
    aftermarketParts: ["M Sport Package", "Premium Sound System"],
    missingParts: null,
    images: ["bmw1.jpg", "bmw2.jpg", "bmw3.jpg"],
  },
  {
    title: "2021 Nissan X-Trail",
    description:
      "Spacious SUV perfect for family trips with excellent safety features.",
    brandName: "nissan",
    categoryName: "SUVs",
    model: "X-Trail",
    year: 2021,
    mileage: 18000,
    color: "White",
    condition: "Excellent",
    price: 42000,
    locationCode: "COL0104",
    status: "available",
    engineSize: "2.0L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "SUV",
    doors: 5,
    seats: 7,
    vin: "5N1AT2MT8MC123456",
    registrationNumber: "NIS001",
    aftermarketParts: ["Roof Rack", "All-Weather Mats"],
    missingParts: null,
    images: ["xtrail1.jpg", "xtrail2.jpg"],
  },
  {
    title: "2017 Ford Ranger",
    description: "Powerful pickup truck ideal for work and outdoor adventures.",
    brandName: "ford",
    categoryName: "Trucks",
    model: "Ranger",
    year: 2017,
    mileage: 65000,
    color: "Red",
    condition: "Good",
    price: 28000,
    locationCode: "COL0105",
    status: "available",
    engineSize: "3.2L",
    fuelType: "Diesel",
    transmission: "Manual",
    bodyStyle: "Pickup",
    doors: 4,
    seats: 5,
    vin: "MFBXXGAJ7HKA12345",
    registrationNumber: "FOR001",
    aftermarketParts: ["Bull Bar", "Tow Hitch"],
    missingParts: null,
    images: ["ranger1.jpg", "ranger2.jpg"],
  },
  {
    title: "2019 Mercedes-Benz C-Class",
    description:
      "Elegant Mercedes C-Class with premium interior and advanced technology.",
    brandName: "mercedes",
    categoryName: "Cars",
    model: "C-Class",
    year: 2019,
    mileage: 22000,
    color: "Silver",
    condition: "Excellent",
    price: 45000,
    locationCode: "COL0106",
    status: "available",
    engineSize: "2.0L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "WDDWF4FB9FR123456",
    registrationNumber: "MER001",
    aftermarketParts: ["AMG Package", "Panoramic Sunroof"],
    missingParts: null,
    images: ["mercedes1.jpg", "mercedes2.jpg"],
  },
  {
    title: "2020 Hyundai Tucson",
    description:
      "Modern SUV with great value and comprehensive warranty coverage.",
    brandName: "hyundai",
    categoryName: "SUVs",
    model: "Tucson",
    year: 2020,
    mileage: 25000,
    color: "Grey",
    condition: "Excellent",
    price: 32000,
    locationCode: "COL0107",
    status: "available",
    engineSize: "2.0L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "SUV",
    doors: 5,
    seats: 5,
    vin: "KM8J3CA46LU123456",
    registrationNumber: "HYU001",
    aftermarketParts: ["Mud Flaps", "Cargo Liner"],
    missingParts: null,
    images: ["tucson1.jpg", "tucson2.jpg"],
  },
  {
    title: "2018 Audi A4",
    description:
      "Sophisticated Audi A4 with quattro all-wheel drive and premium features.",
    brandName: "audi",
    categoryName: "Cars",
    model: "A4",
    year: 2018,
    mileage: 35000,
    color: "Black",
    condition: "Good",
    price: 38000,
    locationCode: "COL0108",
    status: "available",
    engineSize: "2.0L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "Sedan",
    doors: 4,
    seats: 5,
    vin: "WAUZZZ8K9KA123456",
    registrationNumber: "AUD001",
    aftermarketParts: ["S-Line Package", "Bang & Olufsen Sound"],
    missingParts: null,
    images: ["audi1.jpg", "audi2.jpg"],
  },
  {
    title: "2021 Kia Sportage",
    description: "Stylish SUV with excellent safety ratings and modern design.",
    brandName: "kia",
    categoryName: "SUVs",
    model: "Sportage",
    year: 2021,
    mileage: 15000,
    color: "Blue",
    condition: "Excellent",
    price: 35000,
    locationCode: "COL0109",
    status: "available",
    engineSize: "2.0L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "SUV",
    doors: 5,
    seats: 5,
    vin: "KNDPMCAC1M7123456",
    registrationNumber: "KIA001",
    aftermarketParts: ["WeatherTech Mats", "Cargo Net"],
    missingParts: null,
    images: ["sportage1.jpg", "sportage2.jpg"],
  },
  {
    title: "2019 Mazda CX-5",
    description:
      "Premium SUV with Mazda's signature driving dynamics and elegant design.",
    brandName: "mazda",
    categoryName: "SUVs",
    model: "CX-5",
    year: 2019,
    mileage: 30000,
    color: "Red",
    condition: "Excellent",
    price: 33000,
    locationCode: "COL0110",
    status: "available",
    engineSize: "2.5L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "SUV",
    doors: 5,
    seats: 5,
    vin: "JM3KE4DY5K0123456",
    registrationNumber: "MAZ001",
    aftermarketParts: ["Roof Rails", "All-Weather Floor Mats"],
    missingParts: null,
    images: ["cx5_1.jpg", "cx5_2.jpg"],
  },
  {
    title: "2017 Toyota Hilux",
    description:
      "Reliable pickup truck known for durability and excellent resale value.",
    brandName: "toyota",
    categoryName: "Trucks",
    model: "Hilux",
    year: 2017,
    mileage: 75000,
    color: "White",
    condition: "Good",
    price: 25000,
    locationCode: "COL0111",
    status: "available",
    engineSize: "2.4L",
    fuelType: "Diesel",
    transmission: "Manual",
    bodyStyle: "Pickup",
    doors: 4,
    seats: 5,
    vin: "MR0KB29C601234567",
    registrationNumber: "HIL001",
    aftermarketParts: ["Canopy", "Tow Bar"],
    missingParts: null,
    images: ["hilux1.jpg", "hilux2.jpg"],
  },
  {
    title: "2020 Honda CR-V",
    description:
      "Popular SUV with spacious interior and excellent fuel efficiency.",
    brandName: "honda",
    categoryName: "SUVs",
    model: "CR-V",
    year: 2020,
    mileage: 20000,
    color: "Grey",
    condition: "Excellent",
    price: 36000,
    locationCode: "COL0112",
    status: "available",
    engineSize: "1.5L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "SUV",
    doors: 5,
    seats: 5,
    vin: "5FNRL38667B123456",
    registrationNumber: "CRV001",
    aftermarketParts: ["Honda Sensing", "Premium Audio"],
    missingParts: null,
    images: ["crv1.jpg", "crv2.jpg"],
  },
  {
    title: "2018 BMW X3",
    description:
      "Luxury compact SUV with sporty handling and premium features.",
    brandName: "bmw",
    categoryName: "SUVs",
    model: "X3",
    year: 2018,
    mileage: 40000,
    color: "Black",
    condition: "Good",
    price: 42000,
    locationCode: "COL0113",
    status: "available",
    engineSize: "2.0L",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyStyle: "SUV",
    doors: 5,
    seats: 5,
    vin: "5UX2U2C5*JL123456",
    registrationNumber: "X3001",
    aftermarketParts: ["M Sport Package", "Panoramic Sunroof"],
    missingParts: null,
    images: ["x3_1.jpg", "x3_2.jpg"],
  },
  {
    title: "2019 Nissan Leaf",
    description:
      "Electric vehicle with zero emissions and advanced technology features.",
    brandName: "nissan",
    categoryName: "Electric",
    model: "Leaf",
    year: 2019,
    mileage: 15000,
    color: "Blue",
    condition: "Excellent",
    price: 28000,
    locationCode: "COL0114",
    status: "available",
    engineSize: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    bodyStyle: "Hatchback",
    doors: 5,
    seats: 5,
    vin: "1N4AZ1CP5KC123456",
    registrationNumber: "LEA001",
    aftermarketParts: ["Home Charger", "Range Extender"],
    missingParts: null,
    images: ["leaf1.jpg", "leaf2.jpg"],
  },
  {
    title: "2021 Ford Mustang",
    description:
      "Iconic American muscle car with powerful performance and classic styling.",
    brandName: "ford",
    categoryName: "Sports",
    model: "Mustang",
    year: 2021,
    mileage: 8000,
    color: "Red",
    condition: "Excellent",
    price: 55000,
    locationCode: "COL0115",
    status: "available",
    engineSize: "5.0L",
    fuelType: "Gasoline",
    transmission: "Manual",
    bodyStyle: "Coupe",
    doors: 2,
    seats: 4,
    vin: "1FATP8UH5M5123456",
    registrationNumber: "MUS001",
    aftermarketParts: ["Performance Exhaust", "Racing Stripes"],
    missingParts: null,
    images: ["mustang1.jpg", "mustang2.jpg"],
  },
];

export async function seedVehicles(
  brands: Brand[],
  categories: Category[],
  users: User[],
  locations: Location[]
): Promise<Vehicle[]> {
  try {
    logger.info("Starting vehicles seeding...");

    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const brandRepository = AppDataSource.getRepository(Brand);
    const categoryRepository = AppDataSource.getRepository(Category);
    const userRepository = AppDataSource.getRepository(User);
    const locationRepository = AppDataSource.getRepository(Location);

    // Create lookup maps
    const brandMap = new Map(brands.map((brand) => [brand.name, brand]));
    const categoryMap = new Map(
      categories.map((category) => [category.name, category])
    );
    const locationMap = new Map(
      locations.map((location) => [location.code, location])
    );

    // Create vehicles with proper relationships
    const createdVehicles = [];
    for (let i = 0; i < vehicles.length; i++) {
      const vehicleData = vehicles[i];
      const brand = brandMap.get(vehicleData.brandName);
      const category = categoryMap.get(vehicleData.categoryName);
      const location = locationMap.get(vehicleData.locationCode);

      if (!brand) {
        logger.warn(
          `Brand not found: ${vehicleData.brandName}, skipping vehicle: ${vehicleData.title}`
        );
        continue;
      }

      if (!category) {
        logger.warn(
          `Category not found: ${vehicleData.categoryName}, skipping vehicle: ${vehicleData.title}`
        );
        continue;
      }

      if (!location) {
        logger.warn(
          `Location not found: ${vehicleData.locationCode}, skipping vehicle: ${vehicleData.title}`
        );
        continue;
      }

      const vehicle = vehicleRepository.create({
        title: vehicleData.title,
        description: vehicleData.description,
        model: vehicleData.model,
        year: vehicleData.year,
        mileage: vehicleData.mileage,
        color: vehicleData.color,
        condition: vehicleData.condition,
        price: vehicleData.price,
        locationId: location.id,
        status: vehicleData.status,
        engineSize: vehicleData.engineSize,
        fuelType: vehicleData.fuelType,
        transmission: vehicleData.transmission,
        bodyStyle: vehicleData.bodyStyle,
        doors: vehicleData.doors,
        seats: vehicleData.seats,
        vin: vehicleData.vin,
        registrationNumber: vehicleData.registrationNumber,
        aftermarketParts: vehicleData.aftermarketParts,
        missingParts: vehicleData.missingParts,
        images: vehicleData.images,
        brand: brand,
        category: category,
        location: location,
        user: users[i % users.length], // Distribute vehicles among users
      });

      const savedVehicle = await vehicleRepository.save(vehicle);
      createdVehicles.push(savedVehicle);
      logger.info(
        `Created vehicle: ${savedVehicle.title} (Brand: ${brand.displayName}, Category: ${category.name}, Location: ${location.name})`
      );
    }

    logger.info("Vehicles seeding completed successfully", {
      vehicleCount: createdVehicles.length,
    });

    return createdVehicles;
  } catch (error) {
    logger.error("Error seeding vehicles", { error });
    throw error;
  }
}
