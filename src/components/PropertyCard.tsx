import { Link } from "react-router-dom";
import { Bed, Bath, Car, Maximize, MapPin } from "lucide-react";
import { Property, formatPrice, propertyTypeLabel } from "@/data/properties";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link
      to={`/imovel/${property.id}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-smooth hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-brand text-brand-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">
            {propertyTypeLabel[property.type]}
          </span>
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">
            {property.status === "venda" ? "Venda" : "Aluguel"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="text-2xl font-bold text-foreground mb-1">
          {formatPrice(property.price, property.status)}
        </div>
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-brand transition-smooth">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 text-brand" />
          <span>{property.neighborhood ? `${property.neighborhood}, ` : ""}{property.city}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground border-t border-border pt-4">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1.5"><Bed className="h-4 w-4 text-brand" /> {property.bedrooms}</span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1.5"><Bath className="h-4 w-4 text-brand" /> {property.bathrooms}</span>
          )}
          {property.parking != null && (
            <span className="flex items-center gap-1.5"><Car className="h-4 w-4 text-brand" /> {property.parking}</span>
          )}
          {property.area != null && (
            <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4 text-brand" /> {property.area}m²</span>
          )}
        </div>
      </div>
    </Link>
  );
};
