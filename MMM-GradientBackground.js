Module.register("MMM-GradientBackground", {
    defaults: {
        width: "100%%",
        height: "100vh",
        additionalTopMargin: '0px',
        volume: 100,
        timers: [],
        // imagUrl: "modules/MMM-GradientBackground/tree-with-large-sun.jpg",
        imagUrl: "modules/MMM-GradientBackground/jason-leung-wHddViTmSvA-unsplash.jpg",
        suspended: false,
    },

    getStyles: function () {
        return ["MMM-GradientBackground.css"]
    },

    getScripts: function() {
        return [
            'https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js',
        ]
    },

    start: function () {
        var self = this;

        self.wrapper = document.createElement("div");
        self.wrapper.className = "MMM-GradientBackground";
        self.wrapper.id = self.config.uniqueName + "_wrapper";

        self.content = document.createElement("div");
        self.wrapper.appendChild(self.content);

        self.content.className = "content";
        self.content.style.width = self.config.width;
        self.content.style.height = self.config.height;

        self.imageElement = self.createImage();
        self.content.appendChild(self.imageElement);
        
        let emptyDiv = document.createElement("div");
        emptyDiv.className ="emptyGradient";
        self.content.appendChild(emptyDiv);

        self.updateBackgroundGradient();
    },

    getData: function () {
        var self = this;
        var config = Object.assign({}, self.config);

        config.orientation = self.getOrientation();
    },

    getOrientation: function () {
        var self = this;

        if (self.config.orientation === "auto") {
            var viewport = self.getViewport();
            return (viewport.width < viewport.height) ? "vertical" : "horizontal";
        }

        return self.config.orientation;
    },

    createImage: function(imageData) {
        var self = this;
        let imgContainer = document.createElement("div");
        imgContainer.className = "image-container";
        imgContainer.style.background = `url(${self.config.imagUrl}) center center / cover no-repeat`;

        // No need to create a gradient overlay div here
        return imgContainer;
    },
    
    updateBackgroundGradient: function() {
        var self = this;
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = self.config.imagUrl;

        img.onload = function() {
            var colorThief = new ColorThief();
            var colors = colorThief.getPalette(img, 4);

            // Skip the first color and find the darkest color
            var darkestColor = colors.slice(1).reduce((darkest, color) => {
                var brightness = color[0] + color[1] + color[2];
                return brightness < (darkest[0] + darkest[1] + darkest[2]) ? color : darkest;
            }, colors[0]);

            let gradient2 = `linear-gradient(to bottom, rgb(${colors[0].join(",")}), rgb(${darkestColor.join(",")}))`;
            let gradient = `linear-gradient(to bottom, rgb(0,0,0,0) 50%, rgb(${colors[0].join(",")}))`;

            // Apply gradient to the image container using CSS
            var imgContainer = self.content.querySelector(".image-container");
            if (imgContainer) {
                imgContainer.style.setProperty('--gradient', gradient);
            }
            var emptyDiv = self.content.querySelector(".emptyGradient");
            if (emptyDiv) {
                emptyDiv.style.background = gradient2;
            }
        };
    },

    getCommands: function (commander) {

    },

    getDom: function () {
        return this.wrapper;
    },

    getViewport: function () {
        var w = window;
        var e = document.documentElement;
        var g = document.body;

        return {
            width: w.innerWidth || e.clientWidth || g.clientWidth,
            height: w.innerHeight || e.clientHeight || g.clientHeight
        };
    },

    suspend: function () {
        this.suspended = true
    },

    resume: function () {
        this.suspended = false
        let top = document.querySelector("body > div.region.top.bar")
        top.style.top = this.config.additionalTopMargin;

    },

    notificationReceived: function (noti, payload) {
        if (noti == "DOM_OBJECTS_CREATED") {
            this.prepare()
        }
    },

    prepare: function () {

    },
})
