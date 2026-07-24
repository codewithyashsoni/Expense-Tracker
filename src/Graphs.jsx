import React, {useState, useEffect} from "react"
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine
} from "recharts"

const COLORS = [
    "#3B82F6", // Blue
    "#22C55E", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4"  // Cyan
];

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

function Graphs({transactions}){

    function calculatePieChartData(transactionsArray){
        const categoryTotals = {};
        for(const transaction of transactionsArray){
            if(transaction.type !== "Expense"){
                continue;
            }

            if(categoryTotals[transaction.category]){
                categoryTotals[transaction.category] += transaction.amount;
            }else{
                categoryTotals[transaction.category] = transaction.amount;
            }
        }
        return Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            amount
        }));
    }
    const pieChartData = calculatePieChartData(transactions);

    function calculateMonthlyData(transactionsArray){
        const monthlyData=[];
        for(const transaction of transactionsArray){
            const month = new Date(transaction.date).toLocaleDateString("en-US",{month: "short"});
            let monthObject =monthlyData.find(item => item.month === month);

            if(!monthObject){
                monthObject = {
                    month: month,
                    Expense: 0,
                    Income: 0
                }
                monthlyData.push(monthObject);
            }

            if(transaction.type === "Expense"){
                monthObject.Expense += transaction.amount;
            }else{
                monthObject.Income += transaction.amount;
            }
        }
        return monthlyData;
    }
    const monthlyData = calculateMonthlyData(transactions);

    const sortedMonthlyData = [...monthlyData].sort((a, b) => {
    return months.indexOf(a.month) - months.indexOf(b.month);
    });

    function calculateBalanceTrendData(transactionsArray){
        let balance = 0;
        let trendData = [];
        
        for(const transaction of transactionsArray){
            if(transaction.type === "Expense"){
                balance -= transaction.amount;
            }else{
                balance += transaction.amount;
            }
            trendData.push({
                transaction: `T${trendData.length + 1}`,
                balance: balance
            })
        }
        return trendData;
    }
    const balanceTrendData = calculateBalanceTrendData(transactions);

    function renderLabel({ percent }) {
    return `${(percent * 100).toFixed(0)}%`;
    }

    return(
        <div className="charts-container">
            {pieChartData.length > 0 &&
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Expense Breakdown</h3>
                        <p>Category-wise spending</p>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="amount"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={60}
                                paddingAngle={3}
                                stroke="transparent"
                                isAnimationActive={true}
                                animationDuration={2000}
                                label={renderLabel}
                            
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>  
                </div>
            }

            <div className="chart-card">
                <div className="chart-header">
                    <h3>Monthly Overview</h3>
                    <p>Income vs Expense</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                        data={sortedMonthlyData}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 10,
                            bottom: 5
                        }}
                        barGap={8}
                    >
                        <CartesianGrid strokeDashArray="3 3" />
                        <XAxis dataKey="month"/>
                        <YAxis />
                        <Tooltip 
                        formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                        contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff"
                        }}
                        cursor={false}
                        />
                        <Legend />
                        <Bar 
                            dataKey="Income"
                            fill="#22C55E"
                            radius={[6, 6, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                        <Bar 
                            dataKey="Expense"
                            fill="#EF4444" 
                            radius={[6, 6, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={1500}  
                        />   
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card">
                <div className="chart-header">
                    <h3>Balance Trend</h3>
                    <p>Balance over time</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart 
                        data={balanceTrendData}
                    >
                        <CartesianGrid 
                        stroke="#334155"
                        strokeDashArray="3 3" />
                        <XAxis dataKey="transaction"
                        tick={{fill: "#CBD5E1",
                            fontSize :12
                        }}
                        axisLine={{stroke: "#475569"}}
                        tickLine={{stroke: '#475569'}}
                        />
                        <YAxis
                            tick={{ fill: "#CBD5E1", fontSize: 12 }}
                            axisLine={{ stroke: "#475569" }}
                            tickLine={{ stroke: "#475569" }}
                        />
                        <ReferenceLine
                            y={0}
                            stroke="#475569"
                            strokeDashArray="5 5"
                        />
                        <Tooltip
                            cursor={false}
                            formatter={(value) => [
                                `₹${value.toLocaleString("en-IN")}`,
                                "Balance"
                            ]}
                            labelFormatter={(label) => `Transaction: ${label}`}
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                border: "none",
                                borderRadius: "10px",
                                color: "#fff"
                            }}
                        />
                        <Line
                            dataKey="balance"
                            type="monotone"
                            stroke="#60A5FA"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#60A5FA",
                                stroke: "#0F172A",
                                strokeWidth: 2
                            }}
                            activeDot={{
                                r: 7,
                                fill: "#93C5FD",
                                stroke: "#FFFFFF",
                                strokeWidth: 2
                            }}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
export default Graphs