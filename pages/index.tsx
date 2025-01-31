import React, { useState } from 'react';
import { Plus, X, GlassWater, Users, LayoutGrid } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function VanillaUnicornManager() {
  const [tables, setTables] = useState([
    { id: 1, name: 'Table VIP 1', clients: [], boissons: [] },
  ]);

  const [clients, setClients] = useState([]);
  const [nextTableId, setNextTableId] = useState(2);
  const [nextClientId, setNextClientId] = useState(1);
  const [newClientName, setNewClientName] = useState('');
  const [newTableName, setNewTableName] = useState('');

  const [boissons] = useState([
    { id: 1, name: 'Champagne', prix: 300 },
    { id: 2, name: 'Whisky Premium', prix: 200 },
    { id: 3, name: 'Cocktail Signature', prix: 150 }
  ]);

  const ajouterClient = () => {
    if (newClientName.trim()) {
      const newClient = {
        id: nextClientId,
        name: newClientName.trim(),
        vip: true
      };
      setClients([...clients, newClient]);
      setNextClientId(nextClientId + 1);
      setNewClientName('');
    }
  };

  const ajouterTable = () => {
    if (newTableName.trim()) {
      const newTable = {
        id: nextTableId,
        name: newTableName.trim(),
        clients: [],
        boissons: []
      };
      setTables([...tables, newTable]);
      setNextTableId(nextTableId + 1);
      setNewTableName('');
    }
  };

  const supprimerTable = (tableId) => {
    setTables(tables.filter(table => table.id !== tableId));
  };

  const supprimerClient = (clientId) => {
    setClients(clients.filter(client => client.id !== clientId));
    setTables(tables.map(table => ({
      ...table,
      clients: table.clients.filter(c => c.id !== clientId)
    })));
  };

  const assignerClient = (tableId, clientId) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const client = clients.find(c => c.id === clientId);
        if (!table.clients.find(c => c.id === clientId)) {
          return { 
            ...table, 
            clients: [...table.clients, client]
          };
        }
      }
      return table;
    }));
  };

  const retirerClientDeTable = (tableId, clientId) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          clients: table.clients.filter(c => c.id !== clientId)
        };
      }
      return table;
    }));
  };

  const ajouterBoisson = (tableId, boissonId) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const boisson = boissons.find(b => b.id === boissonId);
        return { 
          ...table, 
          boissons: [...table.boissons, boisson]
        };
      }
      return table;
    }));
  };

  const retirerBoisson = (tableId, boissonIndex) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const newBoissons = [...table.boissons];
        newBoissons.splice(boissonIndex, 1);
        return { ...table, boissons: newBoissons };
      }
      return table;
    }));
  };

  const libererTable = (tableId) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return { ...table, clients: [], boissons: [] };
      }
      return table;
    }));
  };

  const getClientsDisponibles = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return clients;
    return clients.filter(client => 
      !table.clients.find(c => c.id === client.id)
    );
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Vanilla Unicorn - Gestion VIP</h1>
      
      <div className="mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mr-2">
              <Users className="h-4 w-4 mr-2" />
              Gérer les Clients
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Gestion des Clients</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nom du client"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                />
                <Button onClick={ajouterClient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {clients.map(client => (
                  <div key={client.id} className="flex justify-between items-center">
                    <span>{client.name}</span>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => supprimerClient(client.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <LayoutGrid className="h-4 w-4 mr-2" />
              Gérer les Tables
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Gestion des Tables</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nom de la table"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                />
                <Button onClick={ajouterTable}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {tables.map(table => (
                  <div key={table.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>{table.name}</span>
                      <Badge variant="secondary">
                        {table.clients.length} client{table.clients.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => supprimerTable(table.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map(table => (
          <Card key={table.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CardTitle>{table.name}</CardTitle>
                  <Badge variant="secondary">
                    {table.clients.length} client{table.clients.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                {table.clients.length > 0 && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => libererTable(table.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardDescription>
                {table.clients.length === 0 
                  ? 'Table disponible' 
                  : `Table occupée par ${table.clients.length} client${table.clients.length !== 1 ? 's' : ''}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Clients</h3>
                <div className="space-y-2">
                  {table.clients.map(client => (
                    <div key={client.id} className="flex justify-between items-center">
                      <span className="text-sm">{client.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => retirerClientDeTable(table.id, client.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un client</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-2">
                      {getClientsDisponibles(table.id).length > 0 ? (
                        getClientsDisponibles(table.id).map(client => (
                          <Button
                            key={client.id}
                            variant="outline"
                            onClick={() => {
                              assignerClient(table.id, client.id);
                            }}
                          >
                            {client.name}
                          </Button>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          Aucun client disponible. 
                          Ajoutez des clients via le bouton "Gérer les Clients".
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Boissons</h3>
                {table.boissons.map((boisson, index) => (
                  <div key={index} className="flex justify-between items-center mb-1">
                    <span className="text-sm">{boisson.name}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => retirerBoisson(table.id, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {table.clients.length > 0 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2">
                        <GlassWater className="h-4 w-4 mr-2" />
                        Ajouter Boisson
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Choisir une boisson</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-2">
                        {boissons.map(boisson => (
                          <Button
                            key={boisson.id}
                            variant="outline"
                            onClick={() => {
                              ajouterBoisson(table.id, boisson.id);
                            }}
                          >
                            {boisson.name} - ${boisson.prix}
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
