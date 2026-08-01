import { z } from "zod";

export const Sectors = [
  "Boutique de vêtements",
  "Restaurant / food",
  "Cosmétiques & beauté",
  "Pharmacie / santé",
  "Électronique",
  "Immobilier",
  "Artisan / fait-main",
  "Formateur / cours & coaching",
  "Librairie / papeterie",
  "Supermarché / épicerie",
] as const;

export const SectorSchema = z.enum(Sectors, {
  errorMap: () => ({ message: "Le secteur d'activité spécifié est invalide" }),
});

export type Sector = z.infer<typeof SectorSchema>;

// Hex Color regex validator
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const HexColorSchema = z.string().regex(hexColorRegex, {
  message: "Le code couleur doit être un format hexadécimal valide (ex: #ffffff ou #fff)",
});

// WhatsApp Number schema with E.164 and Cameroon default
export const WhatsAppNumberSchema = z
  .string({ required_error: "Le numéro WhatsApp est requis" })
  .trim()
  .transform((val) => {
    if (!val.startsWith("+")) {
      if (val.startsWith("237")) {
        return `+${val}`;
      } else if (/^\d{9}$/.test(val)) {
        return `+237${val}`;
      } else {
        return `+${val}`;
      }
    }
    return val;
  })
  .refine((val) => /^\+[1-9]\d{7,14}$/.test(val), {
    message: "Le numéro WhatsApp doit être au format E.164 valide (ex: +237600000000)",
  });

// Slug schema: url-safe, unique, human-editable
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SlugSchema = z
  .string({ required_error: "Le slug est requis" })
  .min(1, "Le slug ne peut pas être vide")
  .regex(slugRegex, {
    message: "Le slug doit être au format URL-safe (minuscules, chiffres et tirets uniquement)",
  });

// Discriminated union for sector specific product fields
export const SectorSpecificFieldsSchema = z.discriminatedUnion("sector", [
  z.object({
    sector: z.literal("Boutique de vêtements"),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    brand: z.string().optional(),
    material: z.string().optional(),
  }),
  z.object({
    sector: z.literal("Restaurant / food"),
    spiceLevel: z.enum(["none", "low", "medium", "hot"]).optional(),
    prepTimeMinutes: z
      .number()
      .int("Le temps de préparation doit être un entier")
      .positive("Le temps de préparation doit être positif")
      .optional(),
    isDietary: z.array(z.string()).optional(),
  }),
  z.object({
    sector: z.literal("Cosmétiques & beauté"),
    skinType: z.array(z.string()).optional(),
    volumeMl: z.number().positive("Le volume doit être positif").optional(),
    ingredients: z.array(z.string()).optional(),
  }),
  z.object({
    sector: z.literal("Pharmacie / santé"),
    requiresPrescription: z.boolean().default(false),
    dosage: z.string().optional(),
    expiryDate: z.string().optional(),
  }),
  z.object({
    sector: z.literal("Électronique"),
    brand: z.string().optional(),
    model: z.string().optional(),
    warrantyMonths: z
      .number()
      .int("La garantie doit être un entier")
      .nonnegative("La garantie ne peut pas être négative")
      .optional(),
    specs: z.record(z.string()).optional(),
  }),
  z.object({
    sector: z.literal("Immobilier"),
    surfaceM2: z.number().positive("La surface doit être positive").optional(),
    rooms: z
      .number()
      .int("Le nombre de pièces doit être un entier")
      .positive("Le nombre de pièces doit être positif")
      .optional(),
    location: z.string().optional(),
    propertyType: z.enum(["appartement", "maison", "terrain", "bureau"]).optional(),
  }),
  z.object({
    sector: z.literal("Artisan / fait-main"),
    craftType: z.string().optional(),
    customizationOptions: z.array(z.string()).optional(),
    productionTimeDays: z
      .number()
      .int("Le temps de production doit être un entier")
      .positive("Le temps de production doit être positif")
      .optional(),
  }),
  z.object({
    sector: z.literal("Formateur / cours & coaching"),
    durationHours: z.number().positive("La durée doit être positive").optional(),
    format: z.enum(["online", "in-person", "hybrid"]).optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  }),
  z.object({
    sector: z.literal("Librairie / papeterie"),
    author: z.string().optional(),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    pages: z
      .number()
      .int("Le nombre de pages doit être un entier")
      .positive("Le nombre de pages doit être positif")
      .optional(),
  }),
  z.object({
    sector: z.literal("Supermarché / épicerie"),
    weightGrams: z.number().positive("Le poids doit être positif").optional(),
    brand: z.string().optional(),
    expirationDate: z.string().optional(),
  }),
]);

export type SectorSpecificFields = z.infer<typeof SectorSpecificFieldsSchema>;

// Base Product Schema
export const BaseProductSchema = z.object({
  id: z
    .string({ required_error: "L'identifiant du produit est requis" })
    .uuid({ message: "L'identifiant du produit doit être un UUID valide" }),
  name: z
    .string({ required_error: "Le nom du produit est requis" })
    .min(1, "Le nom du produit est requis"),
  priceXAF: z
    .number({ required_error: "Le prix est requis" })
    .int("Le prix doit être un nombre entier (FCFA)"),
  description: z
    .string({ required_error: "La description du produit est requise" })
    .min(1, "La description du produit est requise"),
  photoUrls: z
    .array(z.string().url("Le format de la photo doit être une URL valide"), {
      required_error: "Au moins une photo est requise",
    })
    .min(1, "Au moins une photo est requise")
    .max(6, "Le produit ne peut pas avoir plus de 6 photos"),
  category: z
    .string({ required_error: "La catégorie du produit est requise" })
    .min(1, "La catégorie du produit est requise"),
  inStock: z.boolean().default(true),
});

// Full Product Schema with sector-specific-fields
export const ProductSchema = BaseProductSchema.extend({
  sectorSpecificFields: SectorSpecificFieldsSchema,
});

export type Product = z.infer<typeof ProductSchema>;

// Social Links schema
export const SocialLinkSchema = z.object({
  platform: z
    .string({ required_error: "La plateforme de réseau social est requise" })
    .min(1, "La plateforme de réseau social est requise"),
  url: z
    .string({ required_error: "Le format du lien de réseau social doit être une URL valide" })
    .url("Le format du lien de réseau social doit être une URL valide"),
});

// Color Palette schema
export const ColorPaletteSchema = z.object({
  primary: HexColorSchema,
  secondary: HexColorSchema,
  accent: HexColorSchema,
});

// Merchant Config Schema
export const MerchantConfigSchema = z.object({
  id: z
    .string({ required_error: "L'identifiant du marchand est requis" })
    .uuid({ message: "L'identifiant du marchand doit être un UUID valide" }),
  slug: SlugSchema,
  businessName: z
    .string({ required_error: "Le nom de l'entreprise est requis" })
    .min(1, "Le nom de l'entreprise est requis"),
  sector: SectorSchema,
  whatsappNumber: WhatsAppNumberSchema,
  logoUrl: z
    .string({ required_error: "Le format du logo doit être une URL valide" })
    .url("Le format du logo doit être une URL valide"),
  colorPalette: ColorPaletteSchema,
  tagline: z.string({ required_error: "Le slogan est requis" }).min(1, "Le slogan est requis"),
  aboutText: z
    .string({ required_error: "Le texte de description (À propos) est requis" })
    .min(1, "Le texte de description (À propos) est requis"),
  socialLinks: z.array(SocialLinkSchema).optional(),
  verifiedBadge: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.union([z.date(), z.string()], { required_error: "La date de création est requise" }),
  updatedAt: z.union([z.date(), z.string()], {
    required_error: "La date de mise à jour est requise",
  }),
  products: z.array(ProductSchema),
});

export type MerchantConfig = z.infer<typeof MerchantConfigSchema>;

// Lead sources enum
export const LeadSources = ["storefront", "marketplace", "qr", "direct-link"] as const;
export const LeadSourceSchema = z.enum(LeadSources, {
  errorMap: () => ({ message: "Le canal de provenance du lead est invalide" }),
});

export type LeadSource = z.infer<typeof LeadSourceSchema>;

// Lead Record Schema
export const LeadSchema = z.object({
  id: z
    .string({ required_error: "L'identifiant du lead est requis" })
    .uuid({ message: "L'identifiant du lead doit être un UUID valide" }),
  merchantId: z
    .string({ required_error: "L'identifiant du marchand est requis" })
    .uuid({ message: "L'identifiant du marchand doit être un UUID valide" }),
  productIds: z
    .array(z.string().uuid({ message: "L'identifiant du produit doit être un UUID valide" }), {
      required_error: "Au moins un produit doit être associé au lead",
    })
    .min(1, "Au moins un produit doit être associé au lead"),
  referenceCode: z
    .string({ required_error: "Le code de référence est requis" })
    .min(1, "Le code de référence est requis"),
  source: LeadSourceSchema,
  createdAt: z.union([z.date(), z.string()], { required_error: "La date de création est requise" }),
});

export type Lead = z.infer<typeof LeadSchema>;
