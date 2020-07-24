import React from 'react';
import 'babel-polyfill';
import CssInclude from './CssInclude';

const API_HOST = "https://graph.instagram.com/";
const ENDPOINT_MEDIA = "/media";
const ENDPOINT_CHILDREN = "/children";
const FIELDS_MEDIA = "id,caption,permalink,media_type,media_url,thumbnail_url";
const FIELDS_CHILDREN = "permalink,media_url,thumbnail_url";

let cached_response = {
	feed: {},
	album: {}
}

class Captions extends React.Component {
	render() {
		const captionLength = 50;
		return (
			<div className="caption-align"><span className="instagram-captions">
				{
					this.props.showCaption === "show" ?
						this.props.caption.length > captionLength ? this.props.caption.substring(0, captionLength) + "..." : this.props.caption
						: ""
				}
			</span></div>
		);
	}
}


export default class extends React.Component {

	constructor(props) {

		super(props);
		this.state = {
			fotos: cached_response.feed[this.props.configuration.portletInstance.token || this.props.configuration.portletInstance.token] !== undefined ? cached_response.feed[this.props.configuration.system.token || this.props.configuration.system.token] : undefined,
			slides: "2",
			popup_open: false,
			album: {},
			elementWidth: document.getElementById(this.props.portletElementId).offsetWidth
		}

		this.init = true;
		this.resizeObserver = undefined;
		this.resizeTimeOut = undefined;
		this.canresize = true;

	}

	getInstanceId() {
		return this.props.portletElementId.substring(
			this.props.portletElementId.indexOf('INSTANCE_') + 'INSTANCE_'.length,
			this.props.portletElementId.length - 1
		);
	}

	getNumSlides() {

		const numSlides = !(!!document.getElementById(this.props.portletElementId)) ? undefined :

		Math.floor(
			(document.getElementById(this.props.portletElementId).offsetWidth - 50) / this.props.configuration.portletInstance.imageswidth
		) === 0 ? 1 :
			Math.floor(
				(document.getElementById(this.props.portletElementId).offsetWidth - 50) / this.props.configuration.portletInstance.imageswidth
			) > this.props.configuration.portletInstance.slides ?
			 this.props.configuration.portletInstance.slides :
				Math.floor(
					(document.getElementById(this.props.portletElementId).offsetWidth - 50) / this.props.configuration.portletInstance.imageswidth
				);

		return numSlides;
	}

	resizeCarousel(numSlides) {

		document.documentElement.style.setProperty(`--${this.getInstanceId()}-carousel-width`,
			(this.props.configuration.portletInstance.imageswidth * numSlides) + 'px');

			if (numSlides === 1) {

				if (!!document.querySelector(`#${this.props.portletElementId} .instagram-carousel`)) {
					document.querySelector(`#${this.props.portletElementId} .instagram-carousel`).classList.add('instagram-carousel-responsive');
					document.querySelectorAll(`#${this.props.portletElementId} .instagram-captions`).forEach(x => x.classList.add('instagram-captions-responsive'));
				}

			} else {

				if (!!document.querySelector(`#${this.props.portletElementId} .instagram-carousel`)) {
					document.querySelector(`#${this.props.portletElementId} .instagram-carousel`).classList.remove('instagram-carousel-responsive');
					document.querySelectorAll(`#${this.props.portletElementId} .instagram-captions`).forEach(x => x.classList.remove('instagram-captions-responsive'));
				}

			}

		$(`#${this.props.portletElementId} #instagram-content [data-slick]`).slick("slickSetOption", "slidesToShow", numSlides);
		$(`#${this.props.portletElementId} #instagram-content [data-slick]`).slick("refresh");


	}

	activateResizeTimeOut(numSlides) {

		if (this.init || this.props.configuration.portletInstance.debounce == "0") return;

		this.canresize = false;

		clearTimeout(this.resizeTimeOut);
		this.resizeTimeOut = setTimeout(() => {
			this.canresize = true;
			this.resizeCarousel(numSlides);
		}, parseInt(this.props.configuration.portletInstance.debounce)*1000);

	}

	calculateFirstTime() {
			
		const numSlides = this.getNumSlides();
	
		$(`#${this.props.portletElementId} #instagram-content [data-slick]`).not('.slick-initialized').slick();
		this.resizeObserver = new ResizeObserver((entries) => {
			for (entry of entries) {
				this.calculateSlides(this.getNumSlides());
			}
	   });
		
	   this.resizeObserver.observe(document.getElementById(this.props.portletElementId));
	}

	calculateSlides(curNumSlides) {

		if (!(!!document.getElementById(this.props.portletElementId))) return;

		const newSize = document.getElementById(this.props.portletElementId).offsetWidth;
		const numSlides = this.getNumSlides();
		const carouselWidth = (parseInt(document.documentElement.style.getPropertyValue(`--${this.getInstanceId()}-photo-width`)) * numSlides);
		

		if (this.detectNodeResize(newSize)) {

			if ((newSize > carouselWidth)
				&& this.props.configuration.portletInstance.slides != "1") {

				if (!this.canresize || numSlides > this.props.configuration.portletInstance.slides) return;

				this.resizeCarousel(numSlides);
				this.activateResizeTimeOut(curNumSlides, numSlides);

				return;

			} else if ((newSize > carouselWidth) && this.props.configuration.portletInstance.slides == "1") {

				document.documentElement.style.setProperty(`--${this.getInstanceId()}-carousel-width`,
					document.documentElement.style.getPropertyValue(`--${this.getInstanceId()}-photo-width`));

				return;

			}

		} else {

			if (carouselWidth < newSize) {

				if (this.props.configuration.portletInstance.slides != "1") {

					if (!this.canresize) return;
					this.resizeCarousel(numSlides);
					this.activateResizeTimeOut(curNumSlides, numSlides);

					return;

				} else if (numSlides == 1) {

					return;

				}

			}

		}

	}

	componentDidMount() {
		
		const getInstagramPosts = async () => {


			if (JSON.stringify(cached_response.feed) === "{}") {

				const response = await fetch(`${API_HOST}${this.props.configuration.portletInstance.userid === "" ? this.props.configuration.system.userid : this.props.configuration.portletInstance.userid}${ENDPOINT_MEDIA}?fields=${FIELDS_MEDIA}&access_token=${this.props.configuration.portletInstance.token === "" ? this.props.configuration.system.token : this.props.configuration.portletInstance.token}`
				);
				const fotos = await response.json();
				
				cached_response.feed[this.props.configuration.portletInstance.token || this.props.configuration.system.token] = fotos.data;		
				
				this.setState({fotos: fotos.data});

			}else 
				this.setState({fotos: cached_response.feed[this.props.configuration.portletInstance.token || this.props.configuration.system.token]});

			document.documentElement.style.setProperty(`--${this.getInstanceId()}-photo-width`, this.props.configuration.portletInstance.imageswidth +
				'px');
			document.documentElement.style.setProperty(`--${this.getInstanceId()}-photo-height`, this.props.configuration.portletInstance.imagesheight +
				'px');
			document.documentElement.style.setProperty(`--${this.getInstanceId()}-fuente`, this.props.configuration.portletInstance.fontsize +
				'px');
			document.documentElement.style.setProperty(`--${this.getInstanceId()}-caption-width`, parseInt(this.props.configuration.portletInstance.imageswidth) - 20 +
				'px');
			document.documentElement.style.setProperty(`--${this.getInstanceId()}-margin-captions`, parseInt(this.props.configuration.portletInstance.imagesheight) - 60 - parseInt(this.props.configuration.portletInstance.fontsize) +
				'px');

			document.documentElement.style.setProperty(`--${this.getInstanceId()}-carousel-width`, parseInt(this.props.configuration.portletInstance.imageswidth) * parseInt(this.props.configuration.portletInstance.slides) + 'px');
			
			this.props.configuration.portletInstance.rows > 1 ?
				document.documentElement.style.setProperty(`--${this.getInstanceId()}-carousel-height`, (this.props.configuration.portletInstance.imagesheight * 2) +
				'px') :
				document.documentElement.style.setProperty(`--${this.getInstanceId()}-carousel-height`, this.props.configuration.portletInstance.imagesheight +
				'px');

			this.props.configuration.portletInstance.rows > 1 ?
				document.documentElement.style.setProperty(`--${this.getInstanceId()}-slick-slide-height`, this.props.configuration.portletInstance.imagesheight +
				'px') :
				document.documentElement.style.setProperty(`--${this.getInstanceId()}-slick-slide-height`, 'unset');		

		};

		getInstagramPosts();
		if (this.init) this.calculateFirstTime(); else this.calculateSlides();
		this.init = false;

	}

	componentWillUnmount() {
		this.resizeObserver.unobserve(document.getElementById(this.props.portletElementId));
	}

	detectNodeResize(newWidth) {
		if (this.state.elementWidth <= newWidth) {
			this.setState({
				elementWidth: newWidth
			});
			return true;
		} else {;
			this.setState({
				elementWidth: newWidth
			});
			return false;
		}
	
	}

	async albumButton(media_id) {

		
		document.querySelector(`#${this.props.portletElementId} #instagram-album-popup`).classList.add("instagram-album-carousel-show");
		document.querySelector(`#${this.props.portletElementId} #instagram-album-popup .spinner`).classList.add("spiner-show");

		if (cached_response.album[media_id] === undefined) {

			const response = await fetch(`${API_HOST}${media_id}${ENDPOINT_CHILDREN}?fields=${FIELDS_CHILDREN}&access_token=${this.props.configuration.portletInstance.token === "" ? this.props.configuration.system.token : this.props.configuration.portletInstance.token}`);
			const data = await response.json();
			cached_response.album[media_id] = data;
			this.setState({ popup_open: true, album: data });

		} else
			this.setState({ popup_open: true, album: cached_response.album[media_id] });

		document.querySelector(`#${this.props.portletElementId} #instagram-album-popup .spinner`).classList.remove("spiner-show");

	}

	componentDidUpdate() {

		if (!!document.querySelector(`#${this.props.portletElementId} #instagram-album-slick`) && !document.querySelector(`#${this.props.portletElementId} #instagram-album-slick`).classList.contains('slick-initialized'))
			$(`#${this.props.portletElementId} #instagram-album-slick`).slick();
		else if (!!document.querySelector(`#${this.props.portletElementId} #instagram-album-slick`) && !document.querySelector(`#${this.props.portletElementId} #instagram-album-popup`).classList.contains('instagram-album-carousel-show') && document.getElementById('instagram-album-slick').classList.contains('slick-initialized'))
			document.querySelector(`#${this.props.portletElementId} #instagram-album-carousel`).remove();

		$(`#${this.props.portletElementId} #instagram-content [data-slick]`).not('.slick-initialized').slick();

	}

	hideAlbum() {
		document.querySelector(`#${this.props.portletElementId} #instagram-album-popup`).classList.remove("instagram-album-carousel-show");
		this.setState({ popup_open: false });
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
			dots: false,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
			speed: 500,
			rows: parseInt(this.props.configuration.portletInstance.rows),
			arrows: false,
			slidesToShow: this.getNumSlides(),
			slidesToScroll: 1
		};

		const popup_settings = {
			dots: false,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 5000,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1
		};

		return (
			<div id={this.getInstanceId()}>	
				<CssInclude instance={this.getInstanceId()} />
				{ this.state.fotos !== undefined ?
				<div id="instagram-content">
					<div className="instagram-carousel">
						<div data-slick={JSON.stringify(settings)}>
							{
								this.state.fotos.map((post, index) => {
									return (
										<div key={index} className="foto-slides">
											{post.media_type === "CAROUSEL_ALBUM" ?
												<div className="instagram-icono-album">
													<svg onClick={() => this.albumButton(post.id)} aria-hidden="true" focusable="false" data-icon="images" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M480 416v16c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V176c0-26.51 21.49-48 48-48h16v208c0 44.112 35.888 80 80 80h336zm96-80V80c0-26.51-21.49-48-48-48H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48h384c26.51 0 48-21.49 48-48zM256 128c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-96 144l55.515-55.515c4.686-4.686 12.284-4.686 16.971 0L272 256l135.515-135.515c4.686-4.686 12.284-4.686 16.971 0L512 208v112H160v-48z"></path></svg>
												</div>
												: ""}
											<a className="instagram-enlaces" href={post.permalink} onMouseOver={this.hoveredItemEnter} onMouseLeave={this.hoveredItemLeave}>
												<Captions
													showCaption={this.props.configuration.portletInstance.showcaptions}
													caption={post.caption}
												></Captions>
												<img name="instagram-imagenes" className={this.state.hovered ? "instagram-hovered" : ""} src={post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url} />
											</a>
										</div>
									);
								})
							}
						</div>
					</div>
				</div>
					: ""}
				<div id="instagram-album-popup">
					<div className="spinner">
						<div className="bounce1"></div>
						<div className="bounce2"></div>
						<div className="bounce3"></div>
					</div>
					{
						this.state.popup_open ?

							<div id="instagram-album-carousel" className={this.getNumSlides() == 1 ? "instagram-album-carousel-responsive" : ""}>
								<div id="instagram-album-popup-close" onClick={() => this.hideAlbum()}><svg id="icon-instagram-album-close" aria-hidden="true" focusable="false" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></div>
								<div id="instagram-album-slick" data-slick={JSON.stringify(popup_settings)}>
									{
										this.state.album.data.map((o, index) => {
											return (
												<div key={index}>
													<img className={this.getNumSlides() == 1 ? "instagram-album-imagenes instagram-album-imagenes-responsive" : "instagram-album-imagenes"} src={o.media_url} />
												</div>
											);
										})
									}
								</div>
							</div>

							: ""
					}
				</div>
			</div>
		);
	}
}