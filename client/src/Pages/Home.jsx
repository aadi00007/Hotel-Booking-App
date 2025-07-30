import React from "react";
import FeaturedDestination from "../components/FeaturedDestination.jsx";
import Hero from "../components/Hero.jsx";
import ExclusiveOffers from "../components/ExclusiveOffers.jsx";
import Testimonial from "../components/Testimonial.jsx";
import NewsLetters from "../components/NewsLetters.jsx";
import Footer from "../components/Footer.jsx";
import RecommendedHotels from "../components/RecommendedHotels.jsx";


const Home =()=>{
    return(
        <>
            <Hero/>
            <RecommendedHotels/>
            <FeaturedDestination/>
            <ExclusiveOffers/>
            <Testimonial />
            <NewsLetters/>
            

        </>

    )
}
export default Home