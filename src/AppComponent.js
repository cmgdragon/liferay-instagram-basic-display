import React from 'react';
import Slider from "react-slick";
import AppendHead from 'react-append-head';
import 'babel-polyfill';

const API_HOST = "https://graph.instagram.com/";
const ENDPOINT = "/media";
const FIELDS = "id,caption,permalink,media_type,media_url,thumbnail_url";

let lastW = window.outerHeight;

function detectWindowResize() {

   let x = window.innerWidth;

   if (lastW <= x) {
      lastW = x;
      return true;
   } else {
     lastW = x;
     return false
    }

}

class Album extends React.Component {

  render() {
    return (
      <div className="icono-album">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="images" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path></svg>
      </div>
    );
  }

}


export default class extends React.Component {

  constructor() {

    super();
    this.state = {
      fotos: [],
      slides: "3"
     }

  }

  calcularSize() {

    let numSlides = parseInt(this.state.slides);

		if (detectWindowResize()) {
			let carouselWidth = (parseInt(document.documentElement.style.getPropertyValue("--photo-width")) * numSlides) + 300;
			console.log(document.documentElement.clientWidth, carouselWidth, typeof this.props.configuration.portletInstance.slides, this.props.configuration.portletInstance.slides);

			document.getElementsByTagName("body")[0].style.backgroundColor = "green";
		
		if ((document.documentElement.clientWidth > carouselWidth) 
			&& this.props.configuration.portletInstance.slides != "1") {
			console.log("ok1");

			if (this.state.slides >= this.props.configuration.portletInstance.slides) return;

			document.documentElement.style.setProperty("--carousel-width",
			parseInt(this.props.configuration.portletInstance.imageswidth)*(numSlides+1)+'px');

			this.setState({ 
			slides: numSlides+1
			});
	
		} else if ((document.documentElement.clientWidth > carouselWidth) && this.props.configuration.portletInstance.slides == "1") {
			document.documentElement.style.setProperty('--carousel-width', 
			document.documentElement.style.getPropertyValue("--photo-width"));
			this.setState({ 
				slides: "1"
				});
		}

		} else {

		document.getElementsByTagName("body")[0].style.backgroundColor = "red";
		let carouselWidth = (parseInt(document.documentElement.style.getPropertyValue("--photo-width")) * numSlides) + 100;
		console.log(document.documentElement.clientWidth, carouselWidth, typeof this.props.configuration.portletInstance.slides, this.props.configuration.portletInstance.slides);

		if (document.documentElement.clientWidth < carouselWidth) {
			console.log("ok2");

			if (this.props.configuration.portletInstance.slides != "1") {

				if (this.state.slides <= 1) return;

				document.documentElement.style.setProperty("--carousel-width",
				parseInt(this.props.configuration.portletInstance.imageswidth)*(numSlides-1)+'px');	

			this.setState({ 
				slides: numSlides-1
				});

			} else if (this.state.slides == "1") {
				this.setState({ 
					slides: 1
					});
			}


	
		}

	}

	console.log("slides",this.state.slides)
  }


  componentDidMount() {

	console.log(this.props.configuration);
	const getInstagramPosts = async () => {
	const response = await fetch(`${API_HOST}${this.props.configuration.portletInstance.userid === "" ? this.props.configuration.system.userid : this.props.configuration.portletInstance.userid}${ENDPOINT}?fields=${FIELDS}&access_token=${this.props.configuration.portletInstance.token === "" ? this.props.configuration.system.token : this.props.configuration.portletInstance.token}`
	);

	const fotos = await response.json();
	const currentSlides = this.state.slides <= this.props.configuration.portletInstance.slides ? this.state.slides : this.props.configuration.portletInstance.slides;
	
	this.setState({ 
		fotos: fotos.data,
		slides: currentSlides
	});

	document.documentElement.style.setProperty('--photo-width', this.props.configuration.portletInstance.imageswidth+
	'px');
	document.documentElement.style.setProperty('--photo-height', this.props.configuration.portletInstance.imagesheight+
	'px');
	document.documentElement.style.setProperty('--fuente', this.props.configuration.portletInstance.fontsize+
	'px');
	document.documentElement.style.setProperty('--caption-width', parseInt(this.props.configuration.portletInstance.imageswidth)-20+
	'px');


	console.log(parseInt(this.props.configuration.portletInstance.imageswidth)*parseInt(this.props.configuration.portletInstance.slides)+'px');

	document.documentElement.style.setProperty('--carousel-width', parseInt(this.props.configuration.portletInstance.imageswidth)*parseInt(this.props.configuration.portletInstance.slides)+'px');

	this.calcularSize();

	};

	getInstagramPosts();

	window.addEventListener('resize', () => this.calcularSize());

  }

  hoveredItemEnter(e) {
    if (e.target.localName === "span")
      e.target.parentNode.nextSibling.style.filter = "brightness(.4)";
    else
      e.target.style.filter = "brightness(.4)";
  }

  hoveredItemLeave(e) {
    if (e.target.localName === "span")
      e.target.parentNode.nextSibling.style.filter = "brightness(.8)";
    else
      e.target.style.filter = "brightness(.8)";
  }


  render() {
  
    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: parseInt(this.state.slides),
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: parseInt(this.props.configuration.portletInstance.imageswidth),
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true
          }
        }
      ]
    };

    return (
      <div>
      <div id="instagram-content">
        <div className="instagram-carousel">
          <Slider {...settings}>
            {
              this.state.fotos.map((post, index) => {
                return (
                  <div key={index} className="foto-slides">
                    {post.media_type === "CAROUSEL_ALBUM" ? <Album /> : ""}
                    <a className="instagram-enlaces" href={post.permalink} onMouseOver={this.hoveredItemEnter} onMouseLeave={this.hoveredItemLeave}>
                      <div className="caption-align"><span className="instagram-captions">{post.caption}</span></div>
                      <img name="instagram-imagenes" className={this.state.hovered ? "hovered" : ""} src={post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url} />
                    </a>
                  </div>
                );
              })
            }
          </Slider>
        </div>
        {/*JSON.stringify(this.props.configuration)*/}
      </div>
		<AppendHead>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
			<link rel="stylesheet" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
		</AppendHead>
      </div>
    );
  }
}

/*
	render() {
		return (
            <div>
				<div>
        	        <span className="tag">{Liferay.Language.get('portlet-namespace')}:</span>
					<span className="value">{this.props.portletNamespace}</span>
				</div>
				<div>
    	            <span className="tag">{Liferay.Language.get('context-path')}:</span>
					<span className="value">{this.props.contextPath}</span>
				</div>
				<div>
	                <span className="tag">{Liferay.Language.get('portlet-element-id')}:</span>
					<span className="value">{this.props.portletElementId}</span>
				</div>
				<div>
					<span className="tag">{Liferay.Language.get('configuration')}:</span>
					<span className="value pre">{JSON.stringify(this.props.configuration, null, 2)}</span>
				</div>
			</div>
		);
	}
*/