import NavBar from "./components/NavBar";
import {i18n} from "../App";
import React, {useState} from "react";
import {Account} from "../interfaces/user";
const Ainava = require("../stuff/ainava.png")
export default function NewMain() {
    let [logged, setLogged] = useState(false)
    let [account, setAccount] = useState({} as Account)
    return (
        <>
            <div className={"w-full "}>
                <NavBar logged={logged} setLogged={setLogged} account={account} setAccount={setAccount}/>
            </div>
            <div className="flex w-full">
                {/* Left side for text */}
                <div className="w-1/2 p-4">
                    {/* Your text content */}
                    <h1 className="text-2xl font-bold mb-4">Your Text Goes Here</h1>
                    <p className="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam condimentum maximus leo, vitae placerat lacus maximus nec.</p>
                </div>

                {/* Right side for the image */}
                <div className="w-1/2">
                    <img
                        src={Ainava}
                        alt="Description of image"
                        className="w-[60rem] h-[54.6rem] rounded-l-20 bg-cover bg-no-repeat bg-center bg-lightgray bg-blend-overlay mix-blend-overlay"
                    />
                </div>
            </div>
        </>

    )
}