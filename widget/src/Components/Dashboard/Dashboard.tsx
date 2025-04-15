import React from 'react';
import { Column } from '@ant-design/charts';
import { Layout, Typography, theme } from 'antd';

const { Content} = Layout;
const { useToken } = theme;
const { Title } = Typography;

export function Dashboard(): React.ReactElement {
    const { token } = useToken();

    const chartData = [
        { month: '1月', value: 780 },
        { month: '2月', value: 1150 },
        { month: '3月', value: 850 },
        { month: '4月', value: 450 },
        { month: '5月', value: 580 },
        { month: '6月', value: 450 },
        { month: '7月', value: 590 },
        { month: '8月', value: 450 },
        { month: '9月', value: 840 },
        { month: '10月', value: 840 },
        { month: '11月', value: 1180 },
        { month: '12月', value: 950 },
    ];

    const chartConfig = {
        data: chartData,
        xField: 'month',
        yField: 'value',
        color: token.colorPrimary,
        columnStyle: {
            radius: [token.borderRadiusLG, token.borderRadiusLG, 0, 0],
        },
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                    <Title level={2}>Métricas de uso</Title>
                    <div style={{ padding: 24, background: token.colorBgContainer }}>
                        <Title level={4}>Cantidad de usuarios</Title>
                        <Column {...chartConfig} />
                        <Title level={4} style={{ marginTop: token.marginLG }}>Frecuencia de uso</Title>
                        <Column {...chartConfig} />
                        <Title level={4} style={{ marginTop: token.marginLG }}>Duración de conversaciones (por minuto)</Title>
                        <Column {...chartConfig} />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
