import React from "react";
import Chart from "react-apexcharts";

interface IProps {
    type: "line" | "area" | "bar" | "histogram" | "pie" | "donut" |
    "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "radar",
    fridgeType: string
}

interface IState {
    isReady: boolean,
    options: { chart: { id: string }, legend: {}, xaxis: { title: {}, type: string } , title: { text: string, align: string}/*, xaxis: { categories: number[] }*/ }
    series: { name: string, data: number[][] }[]
}

export class ThermomeChart extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isReady: false,
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    title: {
                        text: "time",
                      },
                    type: "datetime"
                },
                legend: {
                    position: 'top'
                  },
                title: {
                    text: 'Temperature Change in a Day',
                    align: 'center'
                },
            },
            series: [],

        };
    }

     async componentDidMount () {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_SERVER}/shop/temp?date=2019-09-01&fridgeType=${this.props.fridgeType}`);
            const result = await res.json();
            console.log(result)
            this.setState({
                series: result.chartData,
                isReady: true
            })
        } catch (e) {
            //res.status(400).json({ msg: 'load failed' })
        }
    }

    render() {
        const { type } = this.props;
        const { options, series } = this.state;
        return this.state.isReady ? (
            <div>
                <Chart
                    options={options}
                    series={series}
                    type={type}
                    height={'600px'}
                />
            </div>
        ) : (<div> Loading... </div>)
    }
}