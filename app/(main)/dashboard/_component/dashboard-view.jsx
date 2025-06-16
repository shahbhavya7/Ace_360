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
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-cyan-500";
      case "medium":
        return "bg-yellow-400";
      case "low":
        return "bg-rose-500";
      default:
        return "bg-muted";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-cyan-400" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-400" };
      case "negative":
        return { icon: TrendingDown, color: "text-rose-500" };
      default:
        return { icon: LineChart, color: "text-muted-foreground" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
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
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
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
            <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-300/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-300">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-cyan-300/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-300">
              {insights.demandLevel}
            </div>
            <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(insights.demandLevel)}`} />
          </CardContent>
        </Card>

        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-cyan-300/60" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
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
          <CardTitle className="text-cyan-300">Salary Ranges by Role</CardTitle>
          <CardDescription className="text-cyan-400/60">
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0f172a] border border-cyan-400/10 rounded-lg p-2 shadow-md">
                          <p className="font-medium text-cyan-200">{label}</p>
                          {payload.map((item) => (
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
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#67e8f9" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#22d3ee" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
          <CardHeader>
            <CardTitle className="text-cyan-300">Key Industry Trends</CardTitle>
            <CardDescription className="text-cyan-400/60">
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
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
            <CardTitle className="text-cyan-300">Recommended Skills</CardTitle>
            <CardDescription className="text-cyan-400/60">
              Skills to consider developing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
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