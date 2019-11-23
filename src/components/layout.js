import React from 'react'
import Sidebar from './Sidebar'
import { Row, Col} from 'react-bootstrap'

export default function Layout ({ children, feedsStore}){
return (
<Row>
<Col sm={3}><Sidebar feedsStore={feedsStore}/>
</Col>
<Col sm={9}>
    {children}
    </Col>
    </Row>)
}