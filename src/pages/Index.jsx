import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Linkedin } from "lucide-react";

const fetchStartups = async () => {
  const response = await axios.get('https://api.crunchbase.com/api/v4/searches/organizations', {
    params: {
      field_ids: ['name', 'short_description', 'location_identifiers', 'num_employees_enum', 'website', 'linkedin'],
      query: 'operating_status:active',
      limit: 50
    },
    headers: {
      'X-CB-User-Key': 'YOUR_CRUNCHBASE_API_KEY'
    }
  });
  return response.data.entities;
};

const Index = () => {
  const { data: startups, isLoading, error } = useQuery({
    queryKey: ['startups'],
    queryFn: fetchStartups
  });

  const [filteredStartups, setFilteredStartups] = useState([]);
  const [teamSizeFilter, setTeamSizeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    if (startups) {
      setFilteredStartups(startups);
    }
  }, [startups]);

  const handleFilter = () => {
    if (!startups) return;

    const filtered = startups.filter(startup => {
      const teamSizeMatch = !teamSizeFilter || 
        (teamSizeFilter === "small" && startup.properties.num_employees_enum === 'c_00001_00010') ||
        (teamSizeFilter === "medium" && startup.properties.num_employees_enum === 'c_00011_00050') ||
        (teamSizeFilter === "large" && startup.properties.num_employees_enum === 'c_00051_00100');
      
      const locationMatch = !locationFilter || 
        startup.properties.location_identifiers.some(loc => 
          loc.value.toLowerCase().includes(locationFilter.toLowerCase())
        );
      
      return teamSizeMatch && locationMatch;
    });
    
    setFilteredStartups(filtered);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Emerging Startups Explorer</h1>
      
      <div className="flex gap-4 mb-6">
        <Select onValueChange={setTeamSizeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Team Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small (1-10)</SelectItem>
            <SelectItem value="medium">Medium (11-50)</SelectItem>
            <SelectItem value="large">Large (51-100)</SelectItem>
          </SelectContent>
        </Select>
        
        <Input 
          placeholder="Location" 
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-[180px]"
        />
        
        <Button onClick={handleFilter}>Filter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filteredStartups.map(startup => (
          <Card key={startup.uuid}>
            <CardHeader>
              <CardTitle>{startup.properties.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{startup.properties.short_description}</p>
              <p>Team Size: {startup.properties.num_employees_enum}</p>
              <p>Location: {startup.properties.location_identifiers.map(loc => loc.value).join(', ')}</p>
              <div className="flex mt-4 space-x-2">
                {startup.properties.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={startup.properties.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {startup.properties.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={startup.properties.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
