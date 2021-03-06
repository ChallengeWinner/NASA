import React, { useEffect, useState, useContext } from "react"
import { document, window } from "browser-monads"
import fetchNasa from "../components/fetchNasa"

import Planet from "../components/Planet"
import SEO from "../components/seo"
import Media from "../components/Media"

import "./main.styl"
import "./animations.styl"
import About from "../components/About"
import DateSelector from "../components/DateSelector"
import { UrlContext } from "../context/context"

export default function IndexPage() {
  const urlData = useContext(UrlContext)
  const [animableItems, setAnimableItems] = useState([])

  var target = document.getElementsByClassName("waiting-animation")

  var options = {
    rootMargin: "0px 150% 0px 100%",
    threshold: 0.5,
  }

  const callback = (entries, observer) => {
    entries.forEach(item => {
      if (item.isIntersecting) {
        item.target.classList.remove("waiting-animation")
        item.target.classList.add("animated")
      }
    })
  }

  const observer = new window.IntersectionObserver(callback, options)

  Array.prototype.forEach.call(animableItems, child => {
    observer.observe(child)
  })

  var data

  if (urlData !== undefined) {
    data = fetchNasa(urlData.url)
  }

  useEffect(() => {
    setAnimableItems(target)
  }, [data, target])

  return (
    <>
      <SEO title="Home" />
      <section className="home grid w-full h-fullvh pl-16 py-40 grid-cols-2 grid-rows-1 font-body">
        <div className="intro grid col-start-1 col-end-2 content-center waiting-animation">
          <div
            id="intro__title"
            className="intro__title flex flex-col text-3xl font-bold font-title leading-none waiting-animation transition-all duration-200"
          >
            NASA Daily Image
          </div>
          <DateSelector />
        </div>
        <div
          id="intro__image"
          className="image flex align-middle image--right col-start-2 col-end-3 "
        >
          <Planet />
        </div>
      </section>
      <About />
      {data && (
        <section className="hero grid h-full text-center bg-black text-white font-body lg:px-56">
          <div className="hero-general-data row-start-1 row-end-2 col-start-1 col-end-2 flex items-start py-20 flex-col lg:mb-32">
            <div className="hero__title mb-16 self-center font-title text-2xl waiting-animation transition-all duration-200">
              {data.title}
            </div>
            <div className="hero__copy my-4 ml-10 waiting-animation transition-all duration-200">
              <div className="border-l-4 border-white  p-4">
                <p className="font-bold text-left">Copyright:</p>
                <p>
                  {data.copyright}
                  {data.copyright === undefined && "Not avaliable"}
                </p>
              </div>
            </div>
            <div className="hero__date my-4 ml-10 waiting-animation transition-all duration-200">
              <div className="border-l-4 border-white p-4">
                <p className="font-bold text-left">Date:</p>
                <p>{data.date}</p>
              </div>
            </div>
          </div>
          <div className="hero__image row-start-2 row-end-3 col-start-1 col-end-2 mx-10 rounded-sm overflow-hidden waiting-animation transition-all duration-200">
            {data.media_type && (
              <Media type={data.media_type} url={data.url} title={data.title} />
            )}
          </div>
          <div className="hero__desc row-start-3 row-end-4 col-start-1 col-end-2 flex text-left mx-10 my-24 leading-snug waiting-animation transition-all duration-200">
            {data.explanation}
          </div>
        </section>
      )}
    </>
  )
}
