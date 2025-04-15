import React from 'react';
import { UndoOutlined } from '@ant-design/icons';
import { Layout, Button, Flex, theme } from 'antd';

const { Header } = Layout;
const { useToken } = theme;

export function Home(): React.ReactElement {
    const { token } = useToken();

    return (
        <Layout>
            <Header style={{ background: token.colorBgContainer, padding: `0 ${token.padding}px` }}>
                <Flex justify="space-between" align="center" style={{ height: '100%' }}>
                    <Button
                        type="primary"
                        shape="circle"
                        style={{
                            background: token.blue6,
                            border: 'none',
                            width: '32px',
                            height: '32px'
                        }}
                    />
                    <Button
                        type="text"
                        icon={<UndoOutlined />}
                        style={{ color: token.colorTextSecondary }}
                    />
                </Flex>
            </Header>
        </Layout>
    );
}
