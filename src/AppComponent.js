import React from 'react';
import Slider from "react-slick";
import AppendHead from 'react-append-head';
import 'babel-polyfill';

const API_HOST = "https://graph.instagram.com/";
const ENDPOINT_MEDIA = "/media";
const ENDPOINT_CHILDREN = "/children";
const FIELDS_MEDIA = "id,caption,permalink,media_type,media_url,thumbnail_url";
const FIELDS_CHILDREN = "permalink,media_url,thumbnail_url";
const componentQuery = "[id^=portlet_liferayinstagrambasicdisplay]";

let lastW = window.outerHeight;
let init = false;

function detectWindowResize() {

	let x = window.innerWidth;

	if (lastW <= x) {
		lastW = x;
		return true;
	} else {
		lastW = x;
		return false;
	}

}

class Captions extends React.Component {
	render() {
		const captionLength = 55;
		return (
			<div className="caption-align"><span className="instagram-captions">
				{
					this.props.showCaption ?
					this.props.caption.length > captionLength ? this.props.caption.substring(0 , captionLength)+"..." : this.props.caption
					: ""
				}
			</span></div>
		);
	}
}

export default class extends React.Component {

	constructor() {

		super();
		this.state = {
			fotos: [],
			slides: "3",
			popup: false
		}

	}

	initCalc() {
		console.log("init calc");
		const numSlides = Math.floor(
			(document.querySelector(componentQuery).offsetWidth - 100) / this.props.configuration.portletInstance.imageswidth
		) === 0 ? 1 :
			Math.floor(
				(document.querySelector(componentQuery).offsetWidth - 100) / this.props.configuration.portletInstance.imageswidth
			) > this.props.configuration.portletInstance.slides ? this.props.configuration.portletInstance.slides :
				Math.floor(
					(document.querySelector(componentQuery).offsetWidth - 100) / this.props.configuration.portletInstance.imageswidth
				)
			;

		if (numSlides === 1) {

			document.querySelector('.instagram-carousel').classList.add('instagram-carousel-responsive');
			document.querySelectorAll('.instagram-captions').forEach(x => x.classList.add('instagram-captions-responsive'));

		}

		document.documentElement.style.setProperty("--carousel-width",
			(this.props.configuration.portletInstance.imageswidth * numSlides) + 'px');

		console.log("nums: ", numSlides);
		console.log("w:", (this.props.configuration.portletInstance.imageswidth * numSlides) + 'px');
		this.setState({
			slides: numSlides
		});

		init = true;

	}

	calcularSize() {

		let numSlides = parseInt(this.state.slides);

		if (detectWindowResize()) {
			let carouselWidth = (parseInt(document.documentElement.style.getPropertyValue("--photo-width")) * numSlides) + 300;
			console.log(document.querySelector(componentQuery).offsetWidth, carouselWidth, typeof this.props.configuration.portletInstance.slides, this.props.configuration.portletInstance.slides);

			//document.getElementsByTagName("body")[0].style.backgroundColor = "green";

			if ((document.querySelector(componentQuery).offsetWidth > carouselWidth)
				&& this.props.configuration.portletInstance.slides != "1") {
				console.log("ok1");

				if (this.state.slides >= this.props.configuration.portletInstance.slides) return;

				document.querySelector('.instagram-carousel').classList.remove('instagram-imagenes-responsive');
				document.querySelectorAll('[name=instagram-imagenes]').forEach(x => x.classList.remove('instagram-imagenes-responsive'));
				document.querySelectorAll('.instagram-captions').forEach(x => x.classList.remove('instagram-captions-responsive'));

				if (!!document.getElementById('instagram-album-carousel')) {
					document.getElementById('instagram-album-carousel').classList.remove('instagram-album-carousel-responsive');
					document.querySelectorAll('.instagram-album-imagenes').forEach(x => x.classList.remove('instagram-album-imagenes-responsive'));
				}

				document.documentElement.style.setProperty("--carousel-width",
					parseInt(this.props.configuration.portletInstance.imageswidth) * (numSlides + 1) + 'px');

				this.setState({
					slides: numSlides + 1
				});

			} else if ((document.querySelector(componentQuery).offsetWidth > carouselWidth) && this.props.configuration.portletInstance.slides == "1") {
				document.documentElement.style.setProperty('--carousel-width',
					document.documentElement.style.getPropertyValue("--photo-width"));
				this.setState({
					slides: "1"
				});
			}

		} else {

			//document.getElementsByTagName("body")[0].style.backgroundColor = "red";
			let carouselWidth = (parseInt(document.documentElement.style.getPropertyValue("--photo-width")) * numSlides) + 100;
			console.log(document.querySelector(componentQuery).offsetWidth, carouselWidth, typeof this.props.configuration.portletInstance.slides, this.props.configuration.portletInstance.slides);

			if (document.querySelector(componentQuery).offsetWidth < carouselWidth) {
				console.log("ok2");

				if (this.props.configuration.portletInstance.slides != "1") {

					if (this.state.slides <= 1) return;

					document.documentElement.style.setProperty("--carousel-width",
						parseInt(this.props.configuration.portletInstance.imageswidth) * (numSlides - 1) + 'px');

					if (numSlides === 2) {
						document.querySelector('.instagram-carousel').classList.add('instagram-carousel-responsive');
						document.querySelectorAll('[name=instagram-imagenes]').forEach(x => x.classList.add('instagram-imagenes-responsive'));
						document.querySelectorAll('.instagram-captions').forEach(x => x.classList.add('instagram-captions-responsive'));

						if (!!document.getElementById('instagram-album-carousel')) {
							document.getElementById('instagram-album-carousel').classList.add('instagram-album-carousel-responsive');
							document.querySelectorAll('.instagram-album-imagenes').forEach(x => x.classList.add('instagram-album-imagenes-responsive'));
						}
					}

					this.setState({
						slides: numSlides - 1
					});

				} else if (this.state.slides == "1") {

					this.setState({
						slides: 1
					});
				}

			}

		}

		console.log("slides", this.state.slides)
	}


	componentDidMount() {

		init = false;

		console.log(this.props.configuration);
		const getInstagramPosts = async () => {
			const response = await fetch(`${API_HOST}${this.props.configuration.portletInstance.userid === "" ? this.props.configuration.system.userid : this.props.configuration.portletInstance.userid}${ENDPOINT_MEDIA}?fields=${FIELDS_MEDIA}&access_token=${this.props.configuration.portletInstance.token === "" ? this.props.configuration.system.token : this.props.configuration.portletInstance.token}`
			);

			const fotos = await response.json();
			const currentSlides = this.state.slides <= this.props.configuration.portletInstance.slides ? this.state.slides : this.props.configuration.portletInstance.slides;

			this.setState({
				fotos: fotos.data,
				slides: currentSlides
			});

			document.documentElement.style.setProperty('--photo-width', this.props.configuration.portletInstance.imageswidth +
				'px');
			document.documentElement.style.setProperty('--photo-height', this.props.configuration.portletInstance.imagesheight +
				'px');
			document.documentElement.style.setProperty('--fuente', this.props.configuration.portletInstance.fontsize +
				'px');
			document.documentElement.style.setProperty('--caption-width', parseInt(this.props.configuration.portletInstance.imageswidth) - 20 +
				'px');


			console.log(parseInt(this.props.configuration.portletInstance.imageswidth) * parseInt(this.props.configuration.portletInstance.slides) + 'px');

			document.documentElement.style.setProperty('--carousel-width', parseInt(this.props.configuration.portletInstance.imageswidth) * parseInt(this.props.configuration.portletInstance.slides) + 'px');

			if (!init) this.initCalc();

		};

		getInstagramPosts();

		window.addEventListener('resize', () => this.calcularSize());

	}

	async albumButton(media_id) {

		console.log("n", this.state.popup);

		const response = await fetch(`${API_HOST}${media_id}${ENDPOINT_CHILDREN}?fields=${FIELDS_CHILDREN}&access_token=${this.props.configuration.portletInstance.token === "" ? this.props.configuration.system.token : this.props.configuration.portletInstance.token}`);
		const data = await response.json();
		console.log(data);

		this.setState({ popup: data });

		document.getElementById("instagram-album-popup").classList.add("instagram-album-carousel-show");

	}

	hideAlbum() {
		document.getElementById("instagram-album-popup").classList.remove("instagram-album-carousel-show");
		this.setState({ popup: false });
	}

	checkInitAlbum() {
		if (this.state.slides == 1) {
			return "";
		}


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

		const settings = {
			dots: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
			speed: 500,
			arrows: false,
			slidesToShow: parseInt(this.state.slides),
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: parseInt(this.props.configuration.portletInstance.imageswidth),
					settings: {
						slidesToShow: 1,
						arrows: false,
						autoplay: true,
						autoplaySpeed: 5000,
						slidesToScroll: 1,
						infinite: true,
						dots: true
					}
				}
			]
		};

		const popup_settings = {
			dots: false,
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1,
		};

		console.log("dataa", this.state.popup.data);
		return (
			<div>
				<div id="instagram-content">
					<div className="instagram-carousel">
						<Slider {...settings}>
							{
								this.state.fotos.map((post, index) => {
									return (
										<div key={index} className="foto-slides">
											{post.media_type === "CAROUSEL_ALBUM" ?
												<div onClick={() => this.albumButton(post.id)} className="instagram-icono-album">
													<svg aria-hidden="true" focusable="false" data-icon="images" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path></svg>
												</div>
												: ""}
											<a className="instagram-enlaces" href={post.permalink} onMouseOver={this.hoveredItemEnter} onMouseLeave={this.hoveredItemLeave}>
												<Captions
													showCaption={this.props.configuration.portletInstance.showcaptions}
													caption={post.caption}
												></Captions>
												<img name="instagram-imagenes" className={this.state.hovered ? "hovered" : ""} src={post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url} />
											</a>
										</div>
									);
								})
							}
						</Slider>
					</div>
				</div>
				<AppendHead>
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
					<link rel="stylesheet" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
				</AppendHead>
				<div id="instagram-album-popup">
					{
						this.state.popup !== false ?

							<div id="instagram-album-carousel" className={this.state.slides == 1 ? "instagram-album-carousel-responsive" : ""}>
								<div id="instagram-album-popup-close" onClick={() => this.hideAlbum()}><svg aria-hidden="true" focusable="false" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></div>
								<Slider {...popup_settings}>
									{
										Array.from(this.state.popup.data).map((o, index) => {
											console.log("p", o);
											return (
												<div key={index}>
													<img className={this.state.slides == 1 ? "instagram-album-imagenes instagram-album-imagenes-responsive" : "instagram-album-imagenes"} src={o.media_url} />
												</div>
											);
										})
									}
								</Slider>
							</div>

							: ""
					}
				</div>

			</div>
		);
	}
}