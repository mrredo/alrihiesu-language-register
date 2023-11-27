import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ParallaxProvider } from 'react-scroll-parallax';
import Main from "./pages/Main"
import './styles/darkswal.scss'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';

import en from './locales/en.json';
import lv from './locales/lv.json';
import MyComponent from "./pages/components/test";
import NewMain from "./pages/NewMain";

const resources = {
  en: { translation: en },
  lv: { translation: lv },
};

i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en', // set the default language
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });

function App() {

  return (
  <ParallaxProvider>
    <BrowserRouter>
      <Routes>
          <Route path={"/"} element={<NewMain/>}/>
          <Route path="/words" element={<Main />} />
          <Route path={"/test"} element={<MyComponent nameList={["word1", "word2", "word3"]}/> }/>
          {/*<Route path="*" element={<NotFound />} />*/}

        </Routes>
    </BrowserRouter>
  </ParallaxProvider>
  );
}

export {
    App, i18n
};
