(function (TorusCycle) {
    function checkRequirements () {
        // Check for WebSocket support.
        if (!("WebSocket" in window)) {
            return  "Your browser doesn't support WebSockets.";
            return false;
        }

        // Checking for WebGL.
        var contexts = ["webgl", "experimental-webgl", "webkit-3d",
                "moz-webgl"];
        var supported = false;

        for (var i = 0, len = contexts.length; i < len; i++) {
            try {
                var context = document.createElement("canvas").getContext(
                        contexts[i]);
                if (context) {
                    supported = true;
                    break;
                }
            } catch (error) {
            }
        }

        if (!supported) {
            return "Your browser doesn't support WebGL.";
        }
        
        return null;
    }
    
    function main() {
        var initialMessage = document.getElementsByClassName(
                "initialMessage")[0];
        var error = checkRequirements();
        if (error == null) {
            initialMessage.parentElement.removeChild(initialMessage);
        } else {
            initialMessage.textContent = error;
            return;
        }
        
        var container = document.createElement("div");
        container.setAttribute("class", "canvasContainer");
        document.body.appendChild(container);
        TorusCycle.start(container);
    }
    
    main();
})(TorusCycle);
