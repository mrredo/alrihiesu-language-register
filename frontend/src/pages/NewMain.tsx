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
            <div className="lg:flex w-full">
                {/* Left side for text */}
                <div className="lg:w-1/2 mb-[40rem] p-4">
                    {/* Your text content */}
                    <h1 className="text-white text-5xl text-center font-bold mb-4">
                        Alrihan official site
                    </h1>
                    <p className="text-gray-500 font-inter text-4xl font-normal leading-normal">
                        Explore the rich history and formation of Alriha country, uncovering its origins and the fascinating stories behind its creation. Delve into the unique aspects that shaped its foundation and discover more about its remarkable evolution.
                    </p>
                </div>

                {/* Right side for the image */}
                <div className="lg:w-1/2 relative flex justify-center">
                    {/* Picture of the Alriha island */}
                    <img
                        src={Ainava}
                        alt="Description of image"
                        className="w-full h-auto lg:max-w-full lg:h-auto rounded-l-20 bg-cover bg-no-repeat bg-center bg-lightgray bg-blend-overlay mix-blend-overlay"
                    />
                    {/* Text on the image */}
                    <div className="absolute top-[80%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold">
                        Picture of Alriha island
                    </div>
                </div>
            </div>
            <div className={"questions grid lg:grid-cols-2 gap-y-[25rem] place-items-start mt-10"}>
                <div className={"mx-[4rem]"}>
                    <div className={"title text-center text-white font-inter italic text-6xl font-normal leading-normal"}>
                        What is our mission?
                    </div>
                    <div className={"description text-gray-500 font-inter text-3xl font-normal leading-normal"}>
                        Empowering discovery and connection, our mission is to showcase the vibrant culture, scenic viewpoints, engaging activities, and evolving language of Alriha. Explore the island's rich heritage, discover stunning vistas, immerse yourself in diverse experiences, and expand linguistic horizons with our evolving dictionary.
                    </div>
                </div>
                <div className={"mx-[4rem]"}>
                    <div className={"title text-center text-white font-inter italic text-6xl font-normal leading-normal"}>
                        What are we?
                    </div>
                    <div className={"description text-gray-500 font-inter text-3xl font-normal leading-normal"}>
                        We are a new nation founded in 2019. It is an island on the Gauja river.
                    </div>
                </div>
                <div className={"mx-[4rem]"}>
                    <div className={"title text-center text-white font-inter italic text-6xl font-normal leading-normal"}>
                        Who are we?
                    </div>
                    <div className={"description text-gray-500 font-inter text-3xl font-normal leading-normal"}>
                        We are citizens of Alriha.
                        Website was programmed by Rihards.
                    </div>
                </div>
                <div className={"mx-[4rem]"}>
                    <div className={"title text-center text-white font-inter italic text-6xl font-normal leading-normal"}>
                        What are the words page?
                    </div>
                    <div className={"description text-gray-500 font-inter text-3xl font-normal leading-normal"}>
                        Its our sort of dictionary, you can view all the words that we have, but only admins with accounts can edit them, but in the soon future you'll be able to submit ideas about new words.
                    </div>
                </div>
            </div>
            <div className={"h-[20rem]"}></div>
        </>

    )
}