import React, { useState } from 'react';
import { Building2, MapPin, Home, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import type { Player, Property } from '../App';

interface PropertyManagerProps {
  players: Player[];
  properties: Property[];
  onBuyLand: (playerId: string, propertyId: string) => void;
  onBuyProperty: (playerId: string, propertyId: string) => void;
  onSellProperty: (playerId: string, propertyId: string) => void;
}

export function PropertyManager({ 
  players, 
  properties, 
  onBuyLand,
  onBuyProperty,
  onSellProperty 
}: PropertyManagerProps) {
  const [filterOwner, setFilterOwner] = useState<string>('all');
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'all' | 'owned'>('all');

  const formatMoney = (value: number) => {
    return `RM ${value.toLocaleString()}`;
  };

  const getOwner = (ownerId?: string) => {
    if (!ownerId) return null;
    return players.find(p => p.id === ownerId);
  };

  const toggleExpand = (propertyId: string) => {
    const newExpanded = new Set(expandedProperties);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedProperties(newExpanded);
  };

  const filteredProperties = filterOwner === 'all' 
    ? properties 
    : filterOwner === 'available'
    ? properties.filter(p => !p.ownerId)
    : properties.filter(p => p.ownerId === filterOwner);

  const sortedProperties = [...filteredProperties].sort((a, b) => a.position - b.position);

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl text-gray-800">Properties</h2>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <label className="flex items-center gap-2 text-gray-700 mb-2">
          <Filter className="w-4 h-4" />
          Filter by Owner
        </label>
        <select
          value={filterOwner}
          onChange={(e) => setFilterOwner(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Properties</option>
          <option value="available">Available Only</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}'s Properties
            </option>
          ))}
        </select>
      </div>

      {/* Property Count */}
      <div className="bg-gray-50 rounded-lg p-3 text-center">
        <p className="text-sm text-gray-600">
          Showing {sortedProperties.length} {sortedProperties.length === 1 ? 'property' : 'properties'}
        </p>
      </div>

      {/* Properties List */}
      <div className="space-y-2">
        {sortedProperties.map((property) => {
          const owner = getOwner(property.ownerId);
          const isExpanded = expandedProperties.has(property.id);
          
          return (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div 
                className="h-1"
                style={{ backgroundColor: property.color }}
              />
              
              {/* Collapsed View - Just Name */}
              <button
                onClick={() => toggleExpand(property.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    #{property.position}
                  </span>
                  <h4 className="text-gray-900">{property.name}</h4>
                </div>
                
                <div className="flex items-center gap-2">
                  {property.hasLand && (
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  )}
                  {property.hasProperty && (
                    <Home className="w-4 h-4 text-blue-600" />
                  )}
                  {owner && (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: owner.color }}
                    />
                  )}
                </div>
              </button>

              {/* Expanded View - Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t">
                  {owner && (
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: owner.color }}
                      />
                      <p className="text-sm text-gray-600">Owned by {owner.name}</p>
                    </div>
                  )}

                  {/* Price Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-500">Land</p>
                      <p className="text-sm text-gray-900">{formatMoney(property.landPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Property</p>
                      <p className="text-sm text-gray-900">{formatMoney(property.propertyPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rent</p>
                      <p className="text-sm text-orange-700">{formatMoney(property.rent)}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex gap-2 mb-3">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      property.hasLand 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <MapPin className="w-3 h-3" />
                      {property.hasLand ? 'Land Owned' : 'No Land'}
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                      property.hasProperty 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Home className="w-3 h-3" />
                      {property.hasProperty ? 'Built' : 'Not Built'}
                    </div>
                  </div>

                  {/* Action Button (Sell only) */}
                  {property.ownerId && (
                    <button
                      onClick={() => onSellProperty(property.ownerId!, property.id)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Sell - Get {formatMoney(Math.floor((property.hasProperty ? property.landPrice + property.propertyPrice : property.landPrice) * 0.5))}
                    </button>
                  )}

                  {!property.ownerId && (
                    <div className="text-center py-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">Available for purchase</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sortedProperties.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No properties found</p>
        </div>
      )}
    </div>
  );
}