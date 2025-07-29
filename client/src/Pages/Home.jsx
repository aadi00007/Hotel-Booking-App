import React from "react";
import FeaturedDestination from "../components/FeaturedDestination";
import Hero from "../components/hero";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonial from "../components/Testimonial";
import NewsLetters from "../components/NewsLetters";
import Footer from "../components/Footer";
import RecommendedHotels from "../components/RecommendedHotels";


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