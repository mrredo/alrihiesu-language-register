import React from "react";
import {Container, Navbar, Nav, NavDropdown} from "react-bootstrap"
import {useTranslation} from "react-i18next";
interface Props {
    setlanguage: (lng: any) => void
    currentLang: string
}
const langtext = {
    "en": "English",
    "lv": "Latvian"
}
const NavBar: React.FC<Props> = ({ setlanguage, currentLang}) => {
    let lang = langtext[currentLang as ("en" | "lv")]
    const { t } = useTranslation()
    return (
        <Navbar expand="lg" className=" bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">{t("navbar_title")}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link disabled  href="/words">{t("navbar_words")}</Nav.Link>
                        <Nav.Link disabled href="/gramatics">{t("navbar_gramatics")}</Nav.Link>
                        <NavDropdown title={`Language-${lang}`} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => setlanguage('en')}>English</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setlanguage('lv')}>Latvian</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default NavBar