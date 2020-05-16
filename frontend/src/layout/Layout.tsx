import React from "react";
import { ThermomeChart } from "../chart/ThermomeChart";
import { Container, Row, Col } from "reactstrap";

export function Layout() {
    return (
        <div className="layout">
            <Container>
                <Row>
                    <Col>
                        <ThermomeChart type="line" fridgeType="Beverage" />
                    </Col>
                    <Col>
                        <ThermomeChart type="line" fridgeType="Freezer" />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
