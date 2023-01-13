<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/norrinRadd8/bike_buddy">
    <img src="assets/images/favicon.png" alt="Logo" width="200" height="200">
  </a>

<a href="https://github.com/norrinRadd8/bike_buddy">
    <img src="assets/images/BIKEBUDDY LOGO WHITE.png" alt="Logo" width="800" height="100">
  </a>

  <p align="center">
  <br/>
    Bike Buddy ensures that your child's cycling adventures are as safe as can be, giving you the ultimate peace of mind. With its cutting-edge route and mapping optimisation technology, you can trust that your little ones are always cycling on the safest roads available. Give yourself the gift of worry-free afternoons and let Bike Buddy be your go-to companion for all things cycling-related.
    <br/>
    <br/>
    Bike Buddy is proudly built by: Dan Shipp, Aurelia Stanculea, Hal Waithe, Michael Yeates, and Hakim Zani.
    <br />
    <br/>
    <a href="https://github.com/norrinRadd8/bike_buddy"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://norrinradd8.github.io/bike_buddy/">View Live Website</a>
    ·
    <a href="https://github.com/norrinRadd8/bike_buddy/issues">Report Bug</a>
    ·
    <a href="https://github.com/norrinRadd8/bike_buddy/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#screenshot">Screenshot</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#user-story">User Story</a></li>
        <li><a href="#description">Description</a></li>
        <li><a href="#apis">APIs</a></li>
        <li><a href="#design">Design</a></li>
        <li><a href="#future-development">Future Development</a></li>
      </ul>
    </li>
    <li>
        <a href="#usage">Usage</a>
      <ul>
        <li><a href="#functionality">Functionality</a></li>
        <li><a href="#mobile-responsive">Mobile Responsive</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

### Screenshot

[![Product Name Screen Shot][product-screenshot]](https://norrinradd8.github.io/bike_buddy/)

<p align="right"><a href="#readme-top">back to top</a></p>

### Built With

- [![Leaflet][leafletjs.com]][leaflet-url]
- [![Bootstrap][bootstrap.com]][bootstrap-url]
- [![JQuery][jquery.com]][jquery-url]

<p align="right"><a href="#readme-top">back to top</a></p>

### User Story

```
AS a concerned parent,
I WANT to easily plot the safest and most efficient cycling routes for my children,
SO THAT I can have peace of mind while they are cycling on the road
```

<p align="right"><a href="#readme-top">back to top</a></p>

### Description

Bike Buddy is the ultimate tool for parents and guardians looking to keep their children safe while cycling. With its interactive map, families can easily search for a location and plot a safe route. This takes into account various factors such as live traffic levels, available bicycle lanes, and lowest elevation to ensure the most efficient and safest route possible for children on the roads.

But Bike Buddy doesn't stop there - it also provides real-time updates on air quality, weather conditions, traffic-flow and traffic incidents, so users can stay informed and prepared for their ride. Users have the ability to view their current location and with Bike Buddy, families can confidently enjoy biking together on the safest roads available.

Say goodbye to repetitive tutorials - our modals tutorial for using the map automatically saves your progress to localStorage, ensuring that you never have to complete it again.

### APIs

Bike Buddy is powered by four main APIs - TomTom Routing, TomTom Reverse Geocoding, OpenWeatherMap, and AQI (Air Quality Index) - to deliver top-notch information and optimised routes to its users. In addition to these APIs, Bike Buddy also utilises the Leaflet.js library, the Jawg Maps Tile API & MapQuest Tile API to provide an interactive and visually appealing map experience. These technologies ensure cycling safety and convenience.

### Design

The design of this app was intended to be child-friendly whilst also appealing to adults & parents. So for the colour scheme a sky blue was chosen as the primary, this colour is friendly yet not too corporate, it's easy on the eyes and still appealing to children. For the vector images we chose to show a family cycling together to solidify to the user what this app is based around. The logo was modified to ensure the letters have a slightly fun and quirky feel to them.

Users are initially greeted with a landing page to give a brief description of what Bike Buddy actually is. From there they go straight to the map dashboard screen. Because the user may not be familiar with our app and because it has some different features to traditional navigation maps we include a modal tutorial to guide the user through our main features.

Because this is a family based-app we wanted to include numerous features to help with the safety of the user. So it was decided that enxt to the map would be various buttons the user could explore to find out information such as traffic flow/ nearby traffic incidents, the air quality of the area. Not to mention general biking safety tips that display at the bottom of the screen.

Overall the app was intended to be simple and straight forward to use for people of all ages, which is why after the landing screen all features are neatly together on the app dashboard, the user isn't even required to input a starting and end address and can simply tap their way to the desination directly on the map.

The app started out as a rough black and white wireframe and transitioned to a fullscale figma prototype where most of the functionality and animations were fleshed out. Link Here: https://www.figma.com/proto/LtBwPWntoCXayy5pIhgsC1/BikeBuddy-(Copy)?scaling=min-zoom&page-id=0%3A1&node-id=1%3A4&starting-point-node-id=1%3A4

### Future Development

Bike Buddy is always looking for ways to improve and enhance the cycling experience for families. We have some exciting ideas that will take Bike Buddy to the next level. With the ability to download routes as a file and see the duration and distance of a chosen route, users can easily track and plan their rides. And with Strava's API integration, users would be able to see their performance statistics and track their progress within Bike Buddy.

Furthermore, a feature where routes are based on the user's past rides and performance on Strava, challenging them to improve their cycling skills and try new routes. Plus, a leaderboard which would allow users to compare their stats with their friends or other Bike Buddy users, adding a fun element of competition. And for added peace of mind, a Bike Buddy safety rating for each generated route.

<p align="right"><a href="#readme-top">back to top</a></p>

<!-- USAGE EXAMPLES -->

## Usage

### Functionality

- The following animation demonstrates the applications functionality

  ![Functionality Gif](assets/images/functionality.gif)

<p align="right"><a href="#readme-top">back to top</a></p>

### Mobile Responsive

- As demonstrated in the screenshot below, this application is designed to be responsive and adjust seamlessly to fit various screen sizes

  ![Responsiveness Screenshot](assets/images/responsive-screenshot.png)

<p align="right"><a href="#readme-top">back to top</a></p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right"><a href="#readme-top">back to top</a></p>

<!-- LICENSE -->

## License

This application may not be edited or re-distributed commercially.

<p align="right"><a href="#readme-top">back to top</a></p>

<!-- CONTACT -->

## Contact

<a href="https://github.com/BrianMillie">Dan Shipp</a>

<a href="https://github.com/auraely">Aurelia Stanculea</a>

<a href="https://github.com/norrinRadd8">Hal Waithe</a>

<a href="https://www.linkedin.com/in/mdyeates/">Michael Yeates</a>

<a href="https://github.com/dezanidesign">Hakim Zani</a>

Project Link: [https://github.com/norrinRadd8/bike_buddy](https://github.com/norrinRadd8/bike_buddy)

<p align="right"><a href="#readme-top">back to top</a></p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [TomTom Routing API](https://developer.tomtom.com/routing-api/documentation/product-information/introduction)
- [TomTom Reverse Geocoding API](https://developer.tomtom.com/reverse-geocoding-api/documentation/product-information/introduction)
- [AQI API](https://aqicn.org/api/)
- [Leaflet.js](https://leafletjs.com/)
- [Jawg Maps](https://www.jawg.io/en/)

<p align="right"><a href="#readme-top">back to top</a></p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/norrinRadd8/bike_buddy.svg?style=for-the-badge
[contributors-url]: https://github.com/norrinRadd8/bike_buddy/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/norrinRadd8/bike_buddy.svg?style=for-the-badge
[forks-url]: https://github.com/norrinRadd8/bike_buddy/network/members
[stars-shield]: https://img.shields.io/github/stars/norrinRadd8/bike_buddy.svg?style=for-the-badge
[stars-url]: https://github.com/norrinRadd8/bike_buddy/stargazers
[issues-shield]: https://img.shields.io/github/issues/norrinRadd8/bike_buddy.svg?style=for-the-badge
[issues-url]: https://github.com/norrinRadd8/bike_buddy/issues
[license-shield]: https://img.shields.io/github/license/norrinRadd8/bike_buddy.svg?style=for-the-badge
[license-url]: https://github.com/norrinRadd8/bike_buddy/blob/master/LICENSE.txt
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: assets/images/screenshot.png
[leafletjs.com]: https://img.shields.io/badge/Leaflet.js-FFFFFF?style=for-the-badge&logo=leaflet&logoColor=green
[leaflet-url]: https://leafletjs.com/
[bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap-url]: https://getbootstrap.com
[jquery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jquery-url]: https://jquery.com
