import React from 'react';

export default class CssInclude extends React.Component {

    render() {

        return(
            <style>
                {`

                    :root{
                        --${this.props.instance}-carousel-height: 240;
                        --${this.props.instance}-carousel-width: 720px;
                        --${this.props.instance}-photo-width: 240px;
                        --${this.props.instance}-photo-height: 240px;
                        --${this.props.instance}-fuente: 16px;
                        --${this.props.instance}-caption-width: 240px;
                        --${this.props.instance}-margin-captions: 180px;
                        --${this.props.instance}-slick-slide-height: unset;
                    }

                    #${this.props.instance} #foto-slides, #${this.props.instance} .slick-slide {
                        max-width: var(--${this.props.instance}-photo-width);
                        width: var(--${this.props.instance}-photo-width);
                    }

                    #instagram-content {
                        display: flex !important;
                        justify-content: center;
                    }

                    #foto-slides {
                        background-color: rgba(0, 0, 0, .5);
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        z-index: 5;
                    }

                    #${this.props.instance} .instagram-carousel {
                        height: var(--${this.props.instance}-carousel-height);
                        width: var(--${this.props.instance}-carousel-width);

                    }
                    
                    #${this.props.instance} .slick-slide > div {
                        height: var(--${this.props.instance}-slick-slide-height);
                    }

                    #${this.props.instance} .instagram-carousel-responsive {
                        height: auto;
                        max-width: var(--${this.props.instance}-carousel-width);
                        width: 100%;
                    }

                    #${this.props.instance} .instagram-enlaces {
                        max-width: var(--${this.props.instance}-photo-width);
                        
                    }

                    #${this.props.instance} [name=instagram-imagenes] {
                        width: var(--${this.props.instance}-photo-width);
                        object-fit: cover;
                        -o-object-fit: cover;
                        filter: brightness(.8);
                        margin: 0;
                        transition: all ease .3s;
                        height: var(--${this.props.instance}-photo-height);
                    }

                    .instagram-imagenes-responsive {
                        width: 100%;
                    }

                    #${this.props.instance} .instagram-captions {
                        color: white;
                        text-shadow: -2px 0px 11px rgba(0, 0, 0, 1);
                        font-weight: bold;
                        position: absolute;
                        z-index: 10;
                        margin-top: var(--${this.props.instance}-margin-captions);
                        max-width: var(--${this.props.instance}-caption-width);
                        font-size: var(--${this.props.instance}-fuente);
                    }

                    #instagram-album-popup {
                        background-color: rgba(0, 0, 0, 0);
                        position: absolute;
                        z-index: 100;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        top: 0;
                        display: none;
                        align-items: center;
                        justify-content: center;
                    }

                    #${this.props.instance} #instagram-album-carousel {
                        width: var(--${this.props.instance}-carousel-height);
                        height: var(--${this.props.instance}-carousel-height);
                        -webkit-box-shadow: 3px 4px 33px 16px rgba(0,0,0,0.75);
                        -moz-box-shadow: 3px 4px 33px 16px rgba(0,0,0,0.75);
                        box-shadow: 3px 4px 33px 16px rgba(0,0,0,0.75);
                    }

                    #${this.props.instance} #instagram-album-slick .slick-slide {
                        max-width: var(--${this.props.instance}-carousel-height);
                    }

                    #instagram-album-popup-close {
                        position: absolute;
                        z-index: 20;
                        color: white;
                        top: 10px;
                        right: 20px;
                    }

                    #${this.props.instance} .instagram-album-carousel-responsive {
                        width: 70vw !important;
                        max-width: var(--${this.props.instance}-photo-width);
                    }

                    #instagram-album-popup-close .slick-track {
                        width: unset;
                    }

                    #icon-instagram-album-close {
                        width: 1.4em;
                    }

                    #instagram-album-popup-close:hover {
                        opacity: .7;
                        cursor: pointer;
                    }

                    #${this.props.instance} .instagram-album-imagenes {
                        width: var(--${this.props.instance}-carousel-height);
                        object-fit: cover;
                        -o-object-fit: cover;
                        filter: brightness(.8);
                        margin: 0;
                        transition: all ease .3s;
                        height: var(--${this.props.instance}-carousel-height);
                    }

                    #${this.props.instance} .instagram-album-imagenes-responsive {
                        width: 70vw !important;
                        max-width: var(--${this.props.instance}-photo-width);
                    }

                    /* Loader from  https://tobiasahlin.com/spinkit/ */
                    #${this.props.instance} .spinner {
                        width: 70px;
                        text-align: center;
                        display: none;
                    }
                    
                    #${this.props.instance} .spiner-show {
                        display: inherit;
                    }

                    #${this.props.instance} .spinner > div {
                        width: 18px;
                        height: 18px;
                        background-color: white;
                    
                        border-radius: 100%;
                        display: inline-block;
                        -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                        animation: sk-bouncedelay 1.4s infinite ease-in-out both;
                    }
                    
                    #${this.props.instance} .spinner .bounce1 {
                        -webkit-animation-delay: -0.32s;
                        animation-delay: -0.32s;
                    }
                    
                    #${this.props.instance} .spinner .bounce2 {
                        -webkit-animation-delay: -0.16s;
                        animation-delay: -0.16s;
                    }
                    
                    /* End loader */


                `}
            </style>
        );

    }

}