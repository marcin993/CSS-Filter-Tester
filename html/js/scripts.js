var CSSFilterTester = {
    fileReader: function() {
        var uploader = document.querySelector("#uploadFile");
        
        uploader.addEventListener("change", function(e) {
            var img = e.target.files[0];
            var patt = /^image\/.*/igm;
            var reader = new FileReader();
            
            if(patt.test(img.type)) {
                reader.onload = function() {
                    var img = new Image();
                    var imgContainer = document.querySelector(".preview-img-container");
                    img.src = this.result;
                    img.setAttribute("id", "img");

                    imgContainer.innerHTML = "";
                    imgContainer.appendChild(img);
                    this.img = img;
                }
            } else {
                this.printError("Proszę wybrać prawidłowy plik graficzny!");
            }
            
            reader.readAsDataURL(img);
            this.img = document.querySelector("#img");
        }.bind(this));
    },
    
    cleanErrorBox: function() {
        var errorBox = document.querySelector(".error");
        setTimeout(function() { document.querySelector(".error").style.marginTop = "-200px"; }, 5000);
        setTimeout(function() { document.body.removeChild(errorBox); }, 7000);
        
    },
    
    printError: function(msg) {
        var errorBox = document.querySelector(".error");
        if(!errorBox) {
            var div = document.createElement("div");
            div.classList.add("error");
            var p = document.createElement("p");
            var pText = document.createTextNode(msg);
            p.appendChild(pText);
            div.appendChild(p);
            document.body.appendChild(div);
        } else {
            var p = document.createElement("p");
            var pText = document.createTextNode(msg);
            p.appendChild(pText);
            errorBox.appendChild(p);
        }
        
        setTimeout(function() { document.querySelector(".error").style.marginTop = 0; }, 1);

        this.cleanErrorBox();
    },
    
    reset: function() {
        var resetBtn = document.querySelector("button[type='reset']");
        this.textInputs = document.querySelectorAll(".controls [type='text']");
        this.rangeInputs = document.querySelectorAll("input[type='range']");
        this.defaultVals = ["0", "100", "100", "0", "0", "0", "100", "100", "0"];
        
        resetBtn.addEventListener("click", function() {
            this.clearFilters();
            this.clearCodeArea();
            
            for(var i = 0; i < this.textInputs.length; i++) {
                this.textInputs[i].value = this.defaultVals[i];
                this.rangeInputs[i].value = this.defaultVals[i];
            }
            
            this.properties = {}
        }.bind(this));
    },
    
    checkPrefixCh: function() {
        if(this.prefixCheckbox.checked) {
                var rules = this.img.getAttribute("style");
                if(rules !== null) {
                    this.img.setAttribute("style", rules + this.addPrefix());
                    this.printCode();
                }
            } else {
                this.applyFilters();
            }
    },
    
    checkPrefixChEvent: function() {
        this.prefixCheckbox.addEventListener("click", function(e) {
            this.checkPrefixCh();
        }.bind(this));
    },
    
    addPrefix: function() {
        return "\n\t-webkit-" + this.img.getAttribute("style");
    },
    
    printCode: function() {
        if(!this.img.getAttribute("style")) {
           return;
        }
        else {
            this.codeArea.textContent = "img { \n \t" + this.img.getAttribute("style") + "\n}";
        }
    },
    
    blur: function(val) {
        this.properties.blur = val + "px";
    },
    
    brightness: function(val) {
        this.properties.brightness = val + "%";
    },
    
    contrast: function(val) {
        this.properties.contrast = val + "%";
    },
    
    grayscale: function(val) {
        this.properties.grayscale = val + "%";
    },
    
    hueRotate: function(val) {
        this.properties.hueRotate = val + "deg";
    },
    
    invert: function(val) {
        this.properties.invert = val + "%";
    },
    
    opacity: function(val) {
        this.properties.opacity = val + "%";
    },
    
    saturate: function(val) {
        this.properties.saturate = val + "%";
    },
    
    sepia: function(val) {
        this.properties.sepia = val + "%";
    },
    
    clearCodeArea: function() {
        this.codeArea.textContent = "img {}";
    },
    
    clearFilters: function() {
        this.img.removeAttribute("style");
    },
    
    applyFilters: function(filter, val) {
        this.img = document.querySelector("#img");
        this.clearFilters();
        switch(filter) {
            case "blur":
                this.blur(val);
                break;
            case "brightness":
                this.brightness(val);
                break;
            case "contrast":
                this.contrast(val);
                break;
            case "grayscale":
                this.grayscale(val);
                break;
            case "hue-rotate":
                this.hueRotate(val);
                break;
            case "invert":
                this.invert(val);
                break;
            case "opacity":
                this.opacity(val);
                break;
            case "saturate":
                this.saturate(val);
                break;
            case "sepia":
                this.sepia(val);
                break;
        }
        
        for(var i in this.properties) {
            if(i == "hueRotate") {
                this.img.style.filter += "hue-rotate(" + this.properties[i] + ")";
            } else {
                this.img.style.filter += i + "(" + this.properties[i] + ")";
            }
            this.cleanUnnecessaryCode(i, this.properties[i]);
        }
        
        this.printCode();
    },
    
    deleteBlankAttr: function() {
        if(this.img.getAttribute("style") == "filter: ;") {
            this.clearFilters();
            this.clearCodeArea();
        }
        
    },
    
    cleanUnnecessaryCode: function(prop, val) {
        var attr = this.img.getAttribute("style");
        
        if(prop == "blur" && val == "0px") {
            var reg = attr.replace(/blur\(.*px\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        if(prop == "brightness" && val == "100%") {
            var reg = attr.replace(/brightness\(\d*%\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        if(prop == "contrast" && val == "100%") {
            var reg = attr.replace(/contrast\(\d*%\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        if(prop == "grayscale" && val == "0%") {
            var reg = attr.replace(/grayscale\(\d*%\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        if(prop == "hueRotate" && val == "0deg") {
            var reg = attr.replace(/hue-rotate\(\d*deg\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        if(prop == "invert" && val == "0%") {
            var reg = attr.replace(/invert\(\d*%\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        if(prop == "opacity" && val == "100%") {
            var reg = attr.replace(/opacity\(\d*%\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        if(prop == "saturate" && val == "100%") {
            var reg = attr.replace(/saturate\(\d*%\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        if(prop == "sepia" && val == "0%") {
            var reg = attr.replace(/sepia\(\d*%\)/g, "");
            this.img.setAttribute("style", reg);
        }
        
        this.deleteBlankAttr();
    },
    
    addEvents: function(i, event, field) {
        if(event == "input") {
            field[i].addEventListener(event, function(e) {
                var valueSpan = e.target.getAttribute("id") + "V";
                var val = e.target.value;
                document.getElementById(valueSpan).value = val;
                
                this.applyFilters(e.target.getAttribute("id"), val);
                this.checkPrefixCh();
            }.bind(this));
        }
        else if (event == "change") {
            field[i].addEventListener(event, function(e) {
                var id = "#" + e.target.getAttribute("id").split("V")[0];
                var val = e.target.value;
                document.querySelector(id).value = val;
                
                this.applyFilters(e.target.getAttribute("id").split("V")[0], val);
                this.checkPrefixCh();
            }.bind(this));
        }
        else {
            console.error("Podano nieprawidłowe zdarzenie dla pętli!");
            return false;
        }
    },
    
    listenerLoop: function(field, event) {
        for(var i = 0; i < field.length; i++) {
            this.addEvents(i, event, field);
        }
    },
    
    printValue: function() {
        var inputsRange = document.querySelectorAll("input[type='range']");
        var inputsText = document.querySelectorAll(".control input[type='text']");

        this.listenerLoop(inputsRange, "input");
        this.listenerLoop(inputsText, "change");
    },
    
    init: function() {
        this.dropZone = document.querySelector(".img");
        this.img = document.querySelector("#img");
        this.codeArea = document.querySelector(".code-area");
        this.prefixCheckbox = document.querySelector("#prefix");
        this.properties = {}
        
        this.fileReader();
        this.checkPrefixChEvent();
        this.printValue();
        this.reset();
    }
}

CSSFilterTester.init();