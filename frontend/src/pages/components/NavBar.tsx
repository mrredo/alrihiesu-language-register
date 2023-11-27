import React, {useEffect, useState} from "react";
import {Container, Navbar, Nav, NavDropdown, Button, Dropdown, Form} from "react-bootstrap"
import {useTranslation} from "react-i18next";
import {Account} from "../../interfaces/user";
import config from "../../config";
import Swal1 from 'sweetalert2'
import withReactContent from "sweetalert2-react-content";
import {i18n} from "../../App";
let Swal = withReactContent(Swal1)
interface Props {
    setlanguage?: (lng: any) => void
    currentLang?: string
    account: Account
    setAccount: (data: any) => void
    logged: boolean
    setLogged: (data: any) => void
}

const langtext = {
    "en": "English",
    "lv": "Latvian"
}
const NavBar: React.FC<Props> = ({ setlanguage, currentLang, account, setAccount, logged, setLogged}) => {
    const { t } = useTranslation()

    useEffect(() => {
        fetch(config.proxy + "/auth/account", {
            credentials: "include"
        }).then(res => {
            if(res.ok) {
                setLogged(true)
                res.json().then(data => setAccount(data))
            }
        })
    }, [])
    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
    }
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: any ) => {
        e.preventDefault();
        // Add your login logic here using 'name' and 'password' state values
        console.log('Email:', name);
        console.log('Password:', password);
        // You can perform your login/authentication logic here
    };
    function logout() {
        fetch(config.proxy + "/auth/logout", {
            method: "POST",
            credentials: "include"
        }).then(res => {
            if(res.ok) {
                setLogged(false)
                setAccount({})
            }
        })
    }
    function login() {
        fetch(config.proxy+ "/auth/login", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                name: name,
                password: password
            })
        }).then(res => {
            res.json().then((user) => {
                if(res.ok) {
                    setAccount(user)
                    setLogged(true)
                } else {
                    Swal.fire({
                        "title": t('error'),
                        html: t(user.error)
                    })
                }
            })

        })
    }
    return (
        <Navbar expand="lg" className={`bg-body-tertiary`}>
            <Container>
                <Navbar.Brand href="/">{t("navbar_title")}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/words">{t("navbar_words")}</Nav.Link>
                        <Nav.Link disabled href="/gramatics">{t("navbar_gramatics")}</Nav.Link>
                        <Nav.Link disabled href="/games">{t("navbar_games")}</Nav.Link>

                        <NavDropdown title={`Language-${t(i18n.language)}`} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => setlanguage != null? setlanguage("en") : changeLanguage("en")}>English</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setlanguage != null? setlanguage("lv") : changeLanguage("lv")}>Latvian</NavDropdown.Item>
                        </NavDropdown>
                        {!logged? (
                            <Nav.Item className={"flex justify-center"}>

                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {t('login')}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className={"px-96"}>
                                        <Form onSubmit={handleLogin} className="px-5 py-3">
                                            <Form.Group controlId="formBasicEmail" className={"w-[15rem] my-1"}>
                                                <Form.Label>{t('name')}</Form.Label>
                                                <Form.Control
                                                    className={"px-28"}
                                                    type="text"
                                                    placeholder={t('enter_name')}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formBasicPassword" className={"w-[15rem] my-1"}>
                                                <Form.Label>{t('password')}</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder={t('enter_password')}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </Form.Group>

                                            <Button variant="primary" onClick={() => login()} className={"my-1"}>
                                                {t('login')}
                                            </Button>
                                        </Form>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {/*<Button onClick={() => console.log("login")} variant={"outline-success"}>{t('login')}</Button>*/}
                            </Nav.Item>
                        ) : (
                            <Nav.Item className={"flex justify-center"}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown">
                                        {account.name}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={logout}>{t('logout')}</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav.Item>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default NavBar