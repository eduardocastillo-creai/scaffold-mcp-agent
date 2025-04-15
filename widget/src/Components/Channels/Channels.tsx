import React from 'react';
import { Layout, Typography, Breadcrumb, Form, Input, Button, theme, Flex, Grid } from 'antd';

const {Content} = Layout;
const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Title, Paragraph } = Typography;

export function Channels(): React.ReactElement {
    const { token } = useToken();
    const screens = useBreakpoint();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <Flex vertical gap={token.marginMD} style={{ padding: 24, background: token.colorBgContainer }}>
                        <Title level={2}>Canales</Title>
                        <Paragraph>
                            En esta sección, configura los canales de integración de tu agente virtual. Define los parámetros técnicos necesarios, como el accessToken, phoneNumberID y otros identificadores clave, para conectar tu agente con los diferentes medios de comunicación y garantizar una integración fluida y segura.
                        </Paragraph>
                        <Form layout="vertical" style={{ maxWidth: screens.md ? '100%' : 600 }}>
                            <Form.Item label="phoneNumber" name="phoneNumber">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="accessToken" name="accessToken">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="phoneNumberId" name="phoneNumberId">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item label="verifyToken" name="verifyToken">
                                <Input placeholder="example" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Guardar</Button>
                            </Form.Item>
                        </Form>
                    </Flex>
                </Content>
            </Layout>
        </Layout>
    );
}
