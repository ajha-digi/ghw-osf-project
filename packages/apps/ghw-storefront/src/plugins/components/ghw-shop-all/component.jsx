/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

 import React from "react";
 import { TOTAL_NUMBER_OF_IMAGES } from "./settings";
 import css from "./ghw-shop-all.css";
 import GenericCarousel from "@oracle-cx-commerce/react-components/generic-carousel";
 import Image from "@oracle-cx-commerce/react-widgets/common/image/component";
 import PropTypes from "prop-types";
 import Styled from "@oracle-cx-commerce/react-components/styled";
 import { isMobile } from "@oracle-cx-commerce/commerce-utils/selector";
 import { useSelector } from "@oracle-cx-commerce/react-components/provider";
 import Img from "@oracle-cx-commerce/react-components/img";
 import Link from "@oracle-cx-commerce/react-components/link";
 
 // This component displays image carousel with hero images.
 const GHWShopAll = (props) => {
   const { isAutoSlide = false, autoSlideInterval = 8000, title } = props;
 
   const mobile = useSelector(isMobile);
 
   //slide details from widget settings.
   const heroImages = [];
 
   for (let index = 1; index <= TOTAL_NUMBER_OF_IMAGES; index++) {
     if (props[`slideMedia-${index}`] && props[`slideMedia-${index}`].src) {
       heroImages.push({
         media: props[`slideMedia-${index}`],
         mediaAlt: props[`slideMediaAlt-${index}`],
         mediaLink: props[`slideMediaLink-${index}`],
         button1Link: props[`button1Link-${index}`],
         sectionTitle: props[`sectionTitle-${index}`],
         mediaLinkBehavior: props[`slideMediaLinkBehavior-${index}`],
         mediaTitle: props[`slideMediaTitle-${index}`],
       });
     }
   }
 
   // Don't display component when no image is selected
   if (heroImages.length === 0) {
     return null;
   }
 
   const slides = [];
 
   for (let index = 0; index < heroImages.length; index++) {
     //remove the leading slash from the route which causes issues with the link (full reload)
     let customCarousel = heroImages[index].mediaLink ?? "";
     if (customCarousel[0] === "/") {
       customCarousel = heroImages[index].mediaLink.substring(1);
     }
 
     const dynamicClass = `bg${index}`;
     const customSlide = (
       <>
       <div className={`carousel-flex product-item ${dynamicClass}`}>
         <div className="title">{heroImages[index].sectionTitle}</div>
           <div className={(`carouselSlide`, "product-img")}>
             <Link href={customCarousel}>
               <Image
                 key={index}
                 {...heroImages[index]}
                 className="carousel-slide"
               />
             </Link>
           </div>
 
           <div className="btn-cnr">
             <a className="button-link" href={heroImages[index].button1Link}>
               Shop Now
             </a>
           </div>
         </div>
       </>
     );
 
     slides.push(customSlide);
   }
 
   return (
     <Styled id="GHWShopAll" css={css}>
       {slides.length > 0 && (
         <div className="GHWShopAll GHWYouMayLike section-home">
           <h1 className="h1-title">{title}</h1>
           <GenericCarousel
             slides={slides}
             itemsPerSlideDesktop={3}
             isAutoSlide={isAutoSlide}
             autoSlideInterval={autoSlideInterval}
             mobile={mobile}
             itemsPerSlide={3}
             showIndicator={true}
             slideIncrementFactor={3}
           />
         </div>
       )}
     </Styled>
   );
 };
 
 GHWShopAll.propTypes = {
   /** Flag used to determine if the slides to translate automatically*/
   isAutoSlide: PropTypes.bool,
 
   /** Interval time to translate slide if the auto slide is true */
   autoSlideInterval: PropTypes.string,
 
   /* Below set of properties are related to image slide 1. 
    The same set are the properties for the 5 image slides with the suffix of slide number */
 
   /* Title value of the image 1 in the slide */
   "slideTitle-1": PropTypes.string,
   /* Media and source value of the image 1 in the slide */
   "slideMedia-1": PropTypes.shape(PropTypes.object.isRequired).isRequired,
   /* Alt text value of the image 1 in the slide */
   "slideMediaAlt-1": PropTypes.string,
   /* Media title value of the image 1 in the slide */
   "slideMediaTitle-1": PropTypes.string,
   /* Media Link value of the image 1 in the slide */
   "slideMediaLink-1": PropTypes.string,
   /*Property which defines if image to open in same window or a new window */
   "slideMediaLinkBehavior-1": PropTypes.string,
 };
 
 GHWShopAll.defaultProps = {
   isAutoSlide: true,
   autoSlideInterval: "8",
   "slideTitle-1": "",
   "slideMediaAlt-1": "",
   "slideMediaTitle-1": "",
   "slideMediaLink-1": "",
   "slideMediaLinkBehavior-1": "",
 };
 export default GHWShopAll;
 