import {useMemo} from "react";
import "./../styles/ProfilePage.css";
import "./../styles/ChartBox.css";
import avatarFallback from "../assets/avatar.png";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function ProfilePage({
                                        user = {
                                            id: "3895126702",
                                            phone: "+421950581235",
                                            email: "bigbob@gmail.com",
                                            avatar: avatarFallback,
                                            verified: true,
                                        },
                                        income = 1500,
                                        costs = 1340,
                                        chartData = {
                                            income: [2, 3, 5, 7, 8, 11, 13, 12, 15, 17, 19, 22],
                                            costs: [2, 2.5, 3, 3.5, 4, 5, 3, 2.8, 4, 5.5, 6, 8],
                                            remain: [0, 1, 2, 4, 5, 6, 9, 9.2, 11, 12, 13, 14.2],
                                        },
                                    }) {
    const remain = useMemo(() => Math.max(0, income - costs), [income, costs]);
    const savingsRate = useMemo(() => {
        if (income <= 0) return 0;
        return ((income - costs) / income * 100).toFixed(2);
    }, [income, costs]);
    return (
        <div className="pf-root">
            {}
            <header className="pf-header">
                <div className="pf-avatar-wrap">
                    <img className="pf-avatar" src={user.avatar} alt="User avatar"/>
                    {user.verified && (
                        <span className="pf-badge" title="Verified">
              {}
                            <svg viewBox="0 0 24 24"><path d="M20 7L9 18l-5-5" fill="none" stroke="white"
                                                           strokeWidth="3"/></svg>
            </span>
                    )}
                </div>

                <div className="pf-ids">
                    <div className="pf-field">
                        <div className="pf-label">User ID:</div>
                        <div className="pf-value">{user.id}</div>
                    </div>
                    <div className="pf-field">
                        <div className="pf-label">Phone Number:</div>
                        <div className="pf-value">{user.phone}</div>
                    </div>
                    <div className="pf-field">
                        <div className="pf-label">Email Address:</div>
                        <div className="pf-value">{user.email}</div>
                    </div>
                </div>
            </header>

            {}
            <section className="pf-overview">
                <h1 className="pf-title">Income overview:</h1>

                <div className="pf-grid">
                    {}
                    <div className="pf-metrics">

                        <Metric label="Approximate income per month:" big value={`${income}$`} color="#0b6cf0"/>
                        <Metric label="Approximate costs per month:" big value={`${costs}$`} color="#e23b2f"/>
                        <Metric label="The remaining money:" big value={`${remain}$`} color="#25c267"/>
                        <Metric label="Savings rate:" big value={`${savingsRate}%`} color="#25c267" style={{
                            color:
                                savingsRate > 9
                                    ? "#25c267"
                                    : savingsRate >= 0
                                        ? "#d6d108"
                                        : "#e23b2f",
                        }}/>
                    </div>

                    {}
                    <ChartBox data={chartData}/>
                </div>
            </section>
        </div>
    );
}

function Metric({label, value, color}) {
    return (
        <div className="pf-metric">
            <div className="pf-metric__label">{label}</div>
            <div className="pf-metric__value" style={{color: "#101828"}}>
                <span className="pf-number-box" style={{color}}>{value}</span>
            </div>
        </div>
    );
}

function ChartBox({data}) {
    const rows = useMemo(() => {
        const n = Math.max(data.income.length, data.costs.length, data.remain.length);
        const clamp = (arr, i) => (i < arr.length ? arr[i] : arr[arr.length - 1] ?? 0);
        return Array.from({length: n}, (_, i) => ({
            month: i + 1,
            income: clamp(data.income, i),
            costs: clamp(data.costs, i),
            remain: clamp(data.remain, i),
        }));
    }, [data]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatMoney = (v) => {
        if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M$";
        if (v >= 1_000) return (v / 1_000).toFixed(1) + "k$";
        return v + "$";
    };
    return (
        <div className="pf-chart">
            <ResponsiveContainer width="100%" height={260}>
                <LineChart
                    data={rows}
                    margin={{top: 10, right: 18, bottom: 8, left: 0}}
                >
                    <CartesianGrid stroke="#e9edf4" strokeDasharray="3 3"/>
                    <XAxis
                        dataKey="month"
                        tickFormatter={(num) => monthNames[num - 1] || num}
                        tick={{fontSize: 12, fill: "#5b6b86"}}
                        axisLine={{stroke: "#c8cfda"}}
                        tickLine={{stroke: "#c8cfda"}}
                    />
                    <YAxis
                        tickFormatter={formatMoney}
                        tick={{fontSize: 12, fill: "#5b6b86"}}
                        axisLine={{stroke: "#c8cfda"}}
                        tickLine={{stroke: "#c8cfda"}}
                    />
                    <Tooltip
                        content={<CustomTooltip/>}
                        cursor={{stroke: "#d9dce3", strokeWidth: 1}}
                    />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#0b6cf0"
                        strokeWidth={3}
                        dot={false}
                        name="Income"
                    />
                    <Line
                        type="monotone"
                        dataKey="remain"
                        stroke="#25c267"
                        strokeWidth={3}
                        dot={false}
                        name="Remain"
                    />
                    <Line
                        type="monotone"
                        dataKey="costs"
                        stroke="#e23b2f"
                        strokeWidth={3}
                        dot={false}
                        name="Costs"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    function CustomTooltip({active, payload}) {
        if (!active || !payload || !payload.length) return null;
        const sorted = [...payload].sort((a, b) => b.value - a.value);

        return (
            <div className="chart-tooltip">
                {sorted.map((entry) => (
                    <div key={entry.dataKey} className="chart-tooltip__row">
          <span
              className="chart-tooltip__dot"
              style={{backgroundColor: entry.color}}
          />
                        <span className="chart-tooltip__name">{entry.name}</span>
                        <span className="chart-tooltip__value">{entry.value}$</span>
                    </div>
                ))}
            </div>
        );
    }

}
