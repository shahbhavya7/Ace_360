"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function PerformanceChart({ assessments }) {
    const [chartData, setChartData] = useState([]); // state to hold formatted chart data

    useEffect(() => { // useEffect to format assessment data for the chart
        if (assessments) { // checks if assessments are available
            const formattedData = assessments.map((assessment) => ({ // if available, maps through each assessment and formats it according to the required structure
                // formats the date and extracts the quiz score and returns an object with date and score properties i.e formattedData
                date: format(new Date(assessment.createdAt), "MMM dd"),
                score: assessment.quizScore,
            }));
            setChartData(formattedData);
        }
    }, [assessments]);
// recharts  in linechart asks for data  in format where data should be an array of objects with date and score properties
    return (
        <Card className="bg-[#0f172a] border border-cyan-400/10 shadow shadow-cyan-400/10">
            <CardHeader>
                <CardTitle
                    className="block text-3xl font-extrabold 
   bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 
                       bg-clip-text text-transparent animate-gradient-slow leading-tight"
                >
                    Performance Trend
                </CardTitle>


                <CardDescription className="text-cyan-400/60">
                    Your quiz scores over time
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" /> {/* slate-700 */}
                            <XAxis
                                dataKey="date"
                                stroke="#38bdf8" // tailwind sky-400 for axis line
                                tick={{ fill: "#7dd3fc", fontSize: 12, fontWeight: 500 }} // sky-300 for numbers
                                axisLine={{ stroke: "#0ea5e9" }} // sky-500
                                tickLine={{ stroke: "#0ea5e9" }}
                            />

                            <YAxis
                                domain={[0, 100]}
                                stroke="#38bdf8" // sky-400 for axis line
                                tick={{ fill: "#7dd3fc", fontSize: 12, fontWeight: 500 }} // sky-300 for tick numbers
                                axisLine={{ stroke: "#0ea5e9" }}
                                tickLine={{ stroke: "#0ea5e9" }}
                            />

                            <Tooltip
                                content={({ active, payload }) => { // payload contains the data for the tooltip autmatically provided by recharts
                                    // via data objects passed to the chart
                                    // active checks if the tooltip is active and payload checks if there is data to display
                                    if (active && payload?.length) {
                                        return (
                                            <div className="bg-[#0f172a] border border-cyan-400/10 rounded-lg p-2 shadow-md">
                                                <p className="text-sm font-medium text-cyan-200">
                                                    Score: {payload[0].value}%
                                                </p>
                                                <p className="text-xs text-cyan-300/60">
                                                    {payload[0].payload.date}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#67e8f9" // cyan-300
                                strokeWidth={2.5}
                                dot={{ stroke: "#22d3ee", strokeWidth: 2, r: 4 }} // cyan-500 dot
                                activeDot={{ r: 6, fill: "#0ea5e9", stroke: "#06b6d4", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
