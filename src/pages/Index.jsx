import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Linkedin } from "lucide-react";

const startups = [
  { id: 1, name: "TechNova", teamSize: 15, location: "San Francisco", website: "https://technova.com", linkedin: "https://linkedin.com/company/technova" },
  { id: 2, name: "GreenEco", teamSize: 8, location: "New York", website: "https://greeneco.com", linkedin: "https://linkedin.com/company/greeneco" },
  { id: 3, name: "AIVision", teamSize: 25, location: "London", website: "https://aivision.com", linkedin: "https://linkedin.com/company/aivision" },
  { id: 4, name: "CloudScale", teamSize: 12, location: "Berlin", website: "https://cloudscale.com", linkedin: "https://linkedin.com/company/cloudscale" },
  { id: 5, name: "BioTech", teamSize: 20, location: "Boston", website: "https://biotech.com", linkedin: "https://linkedin.com/company/biotech" },
];

const Index = () => {
  const [filteredStartups, setFilteredStartups] = useState(startups);
  const [teamSizeFilter, setTeamSizeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const handleFilter = () => {
    let filtered = startups;
    if (teamSizeFilter) {
      filtered = filtered.filter(startup => {
        if (teamSizeFilter === "small") return startup.teamSize <= 10;
        if (teamSizeFilter === "medium") return startup.teamSize > 10 && startup.teamSize <= 50;
        if (teamSizeFilter === "large") return startup.teamSize > 50;
        return true;
      });
    }
    if (locationFilter) {
      filtered = filtered.filter(startup => 
        startup.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
