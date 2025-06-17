"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((range) => ({ // function to format the salary data
    name: range.role,
    min: range.min / 1000, // Convert to thousands
    max: range.max / 1000,
    median: range.median / 1000,
  }));

const getDemandLevelColor = (level) => { // Function to determine the color based on demand level
  switch (level.toLowerCase()) {
    case "high":
      return "bg-cyan-300/80";   // Bright and readable
    case "medium":
      return "bg-yellow-300/70"; // Soft gold for contrast
    case "low":
      return "bg-rose-400/80";   // Muted red for visibility
    default:
      return "bg-slate-600/60";  // Neutral muted background
  }
};

  const getMarketOutlookInfo = (outlook) => { // Function to determine the icon and color based on market outlook
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-cyan-300/80" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-400" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-500" };
      default:
        return { icon: LineChart, color: "text-muted-foreground" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon; // Get the icon and color for market outlook
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color; // Get the color for market outlook

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy"); // Format the last updated date
  const nextUpdateDistance = formatDistanceToNow( // Calculate the time until the next update
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="border-cyan-400/30 text-cyan-300">
          Last updated: {lastUpdatedDate}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle  className="text-sky-400/80 text-lg font-bold">Market Outlook</CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-300">
              {insights.marketOutlook}
            </div>
            <p className="text-xs text-cyan-300/60">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle  className="text-sky-400/80 text-lg font-bold">Industry Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-300/60" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold text-cyan-300">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="[&_[data-slot=progress-indicator]]:bg-sky-400/80" />
          </CardContent>
        </Card>

        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle  className="text-sky-400/80 text-lg font-bold">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-cyan-300/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-300">
              {insights.demandLevel}
            </div>
            <div className={`h-2 w-full rounded-full mt-2 bg-sky-400/80 ${getDemandLevelColor(insights.demandLevel)}`} />
          </CardContent>
        </Card>

        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle  className="text-sky-400/80 text-lg font-bold">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-cyan-300/60" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => ( // Map over the top skills and render a badge for each
                <Badge key={skill} variant="secondary" className="bg-cyan-400/10 text-cyan-200 border-cyan-300/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
<Card className="col-span-4 bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
  <CardHeader>
  <div className="text-sky-400/80 text-lg font-bold">Salary Ranges by Role</div>
  <CardDescription className="text-cyan-400/60">
    Displaying minimum, median, and maximum salaries (in thousands)
  </CardDescription>
</CardHeader>

  <CardContent>
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={salaryData}  activeBar={{ fill: "rgba(14, 165, 233, 0.2)" }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
         <XAxis // sets the x-axis data key to "name" and the stroke color to "#cbd5e1"
            dataKey="name"
            stroke="#cbd5e1" // slate-300 for contrast
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }} // slate-600
            tickLine={{ stroke: "#475569" }}
          />
          <YAxis
            stroke="#cbd5e1"
            tick={{ fill: "#cbd5e1", fontSize: 12 }}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
          />
          <Tooltip // this is the tooltip that appears when you hover over a bar
            content={({ active, payload, label }) => { // active is when we are hovering over a bar, payload is the data (salaryData) to display, 
            // label is the x-axis data (name)
              if (active && payload && payload.length) { // if the tooltip is active and there is data to display , payload is the data to display
                return (
                  <div className="bg-[#0f172a] border border-cyan-400/10 rounded-lg p-2 shadow-md">
                    <p className="font-medium text-cyan-200">{label}</p>
                    {payload.map((item) => ( // map over the payload it has name and value like min salary, median salary, max salary and we are displaying it
                    // each item is a bar in the chart i.e min or median or max salary
                      <p key={item.name} className="text-sm text-cyan-300">
                        {item.name}: ${item.value}K 
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          {/* setting attribute of bar of each item in the bar chart */}
           <Bar 
            dataKey="min" 
            fill="#06b6d4" // cyan-900 #06b6d4
            name="Min Salary (K)"
            radius={[4, 4, 0, 0]}
            
          />
          <Bar
            dataKey="median"
            fill="#0ea5e9" // sky-500
            name="Median Salary (K)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="max"
            fill="#164e63" // cyan-500
            name="Max Salary (K)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader>
            <CardTitle  className="text-sky-400/80 text-lg font-bold">Key Industry Trends</CardTitle>
            <CardDescription className="text-cyan-400/60">
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => ( // Map over the key trends and render a list item for each
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-cyan-400" />
                  <span className="text-cyan-200">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader>
            <CardTitle  className="text-sky-400/80 text-lg font-bold">Recommended Skills</CardTitle>
            <CardDescription className="text-cyan-400/60">
              Skills to consider developing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => ( // Map over the recommended skills and render a badge for each
                <Badge
                  key={skill}
                  variant="outline"
                  className="border-cyan-300/30 text-cyan-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;