import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Linkedin } from "lucide-react";

const generateStartups = (count) => {
  const locations = ["San Francisco", "New York", "London", "Berlin", "Boston", "Tokyo", "Singapore", "Paris", "Toronto", "Sydney"];
  const industries = ["Tech", "Green", "AI", "Cloud", "Biotech", "Fintech", "EdTech", "HealthTech", "AgriTech", "SpaceTech"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${industries[Math.floor(Math.random() * industries.length)]}${Math.floor(Math.random() * 1000)}`,
    teamSize: Math.floor(Math.random() * 100) + 1,
    location: locations[Math.floor(Math.random() * locations.length)],
    website: `https://${industries[Math.floor(Math.random() * industries.length)].toLowerCase()}${Math.floor(Math.random() * 1000)}.com`,
    linkedin: `https://linkedin.com/company/${industries[Math.floor(Math.random() * industries.length)].toLowerCase()}${Math.floor(Math.random() * 1000)}`,
  }));
};

const startups = generateStartups(50);

const Index = () => {
  const [filteredStartups, setFilteredStartups] = useState(startups);
  const [teamSizeFilter, setTeamSizeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const handleFilter = () => {
    const filtered = startups.filter(startup => {
      const teamSizeMatch = !teamSizeFilter || 
        (teamSizeFilter === "small" && startup.teamSize <= 10) ||
        (teamSizeFilter === "medium" && startup.teamSize > 10 && startup.teamSize <= 50) ||
        (teamSizeFilter === "large" && startup.teamSize > 50);
      
      const locationMatch = !locationFilter || 
        startup.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return teamSizeMatch && locationMatch;
    });
    
    setFilteredStartups(filtered);
  };

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
            <SelectItem value="large">Large (50+)</SelectItem>
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
          <Card key={startup.id}>
            <CardHeader>
              <CardTitle>{startup.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Team Size: {startup.teamSize}</p>
              <p>Location: {startup.location}</p>
              <div className="flex mt-4 space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={startup.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Website
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={startup.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
