<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <link rel="icon" type="image/png" href="assets/img/Network.png">


    <!--[if IE]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <![endif]-->
    <title>army_plan</title>
    <!-- BOOTSTRAP CORE STYLE  -->
    <link href="assets/css/bootstrap.css" rel="stylesheet" />
    <!-- FONT AWESOME ICONS  -->
    <link href="assets/css/font-awesome.css" rel="stylesheet" />
    <!-- CUSTOM STYLE  -->
    <link href="assets/css/style.css" rel="stylesheet" />
    <!-- HTML5 Shiv and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->


    <script src="bower_components/Leaflet.draw/docs/examples/libs/leaflet-src.js"></script>
    <link rel="stylesheet" href="bower_components/Leaflet.draw/docs/examples/libs/leaflet.css" />

    <script src="bower_components/Leaflet.draw/src/Leaflet.draw.js"></script>
    <script src="bower_components/Leaflet.draw/src/Leaflet.Draw.Event.js"></script>
    <link rel="stylesheet" href="bower_components/Leaflet.draw/src/leaflet.draw.css" />

    <script src="bower_components/Leaflet.draw/src/Toolbar.js"></script>
    <script src="bower_components/Leaflet.draw/src/Tooltip.js"></script>

    <script src="bower_components/Leaflet.draw/src/ext/GeometryUtil.js"></script>
    <script src="bower_components/Leaflet.draw/src/ext/LatLngUtil.js"></script>
    <script src="bower_components/Leaflet.draw/src/ext/LineUtil.Intersect.js"></script>
    <script src="bower_components/Leaflet.draw/src/ext/Polygon.Intersect.js"></script>
    <script src="bower_components/Leaflet.draw/src/ext/Polyline.Intersect.js"></script>
    <script src="bower_components/Leaflet.draw/src/ext/TouchEvents.js"></script>

    <script src="bower_components/Leaflet.draw/src/draw/DrawToolbar.js"></script>
    <script src="bower_components/Leaflet.draw/src/draw/handler/Draw.Feature.js"></script>
    <script src="bower_components/Leaflet.draw/src/draw/handler/Draw.SimpleShape.js"></script>
    <script src="bower_components/Leaflet.draw/src/draw/handler/Draw.Polyline.js"></script>
    <script src="bower_components/Leaflet.draw/src/draw/handler/Draw.Marker.js"></script>
    <script src="bower_components/Leaflet.draw/src/draw/handler/Draw.CircleMarker.js"></script>
    <script src="bower_components/Leaflet.draw/src/draw/handler/Draw.Circle.js"></script>
    <script src="bower_components/Leaflet.draw/src/draw/handler/Draw.Polygon.js"></script>
    <script src="bower_components/Leaflet.draw/src/draw/handler/Draw.Rectangle.js"></script>

    <script src="bower_components/Leaflet.draw/src/edit/EditToolbar.js"></script>
    <script src="bower_components/Leaflet.draw/src/edit/handler/EditToolbar.Edit.js"></script>
    <script src="bower_components/Leaflet.draw/src/edit/handler/EditToolbar.Delete.js"></script>

    <script src="bower_components/Leaflet.draw/src/Control.Draw.js"></script>

    <script src="bower_components/Leaflet.draw/src/edit/handler/Edit.Poly.js"></script>
    <script src="bower_components/Leaflet.draw/src/edit/handler/Edit.SimpleShape.js"></script>
    <script src="bower_components/Leaflet.draw/src/edit/handler/Edit.Marker.js"></script>
    <script src="bower_components/Leaflet.draw/src/edit/handler/Edit.CircleMarker.js"></script>
    <script src="bower_components/Leaflet.draw/src/edit/handler/Edit.Circle.js"></script>
    <script src="bower_components/Leaflet.draw/src/edit/handler/Edit.Rectangle.js"></script>
    
    
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    
    <script type="text/javascript" src="http://calvinmetcalf.github.io/leaflet-ajax/dist/leaflet.ajax.js"></script>
   

    <script src="assets/js/jquery-1.11.1.js"></script>


</head>

<body>

    <!-- HEADER END-->
    <div class="navbar navbar-inverse set-radius-zero">
        <div class="container">
            <div class="left-div">
                <div class="user-settings-wrapper">
                    <ul class="nav">
                        <li class="dropdown">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- LOGO HEADER END-->


    <!-- LOGO HEADER END-->
    <section class="menu-section ">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="navbar-collapse collapse ">
                        <ul id="menu-top" class="nav navbar-nav navbar-right">
                            <li><a class="menu-top-active" href="index.php">army_plan</a></li>
                            <li><a class="" href="login.html">logout</a></li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </section>
    <!-- MENU SECTION END-->


    <div class="content-wrapper">
        <div class="container">
            <div class="row">

                <div class="col-md-3  col-sm-3">
                    <ul class="nav nav-tabs">
                        <li class="active"><a data-toggle="tab" href="#home">Details</a></li>
                        <li><a data-toggle="tab" href="#menu1">Legend</a></li>
                        <li><a data-toggle="tab" href="#menu2">Tools</a></li>
                    </ul>
                    <div class="tab-content">
                        <div id="home" class="tab-pane fade in active"><br>
                            
                                <fieldset>
                                    <legend>ADD DATA NOW</legend>
                                    <div class="form-group">
                                        <button type="button"  class="btn btn-block" id="draw_line" >polyline</button>
                                    </div>
                                    <div class="form-group">
                                        <button type="button"  class="btn btn-block" id="draw_polygon" >polygon</button>
                                    </div>
                                    <div class="form-group">
                                        <button type="button"  class="btn btn-block" id="draw_marker" >marker</button>
                                    </div>
                                    
                                    <hr>
                                    <div class="form-group">
                                        <button type="button"  class="btn btn-block" id="edit_line" >edit</button>
                                    </div>
                                    <div class="form-group">
                                        <button type="button"  class="btn btn-block" id="draw_delete" >delete</button>
                                    </div>
                                </fieldset>
                            
                        </div>
                        <div id="menu1" class="tab-pane fade">
                            <div id="external_control"></div>
                        </div>
                        <div id="menu2" class="tab-pane fade">
                            <h3>Menu 2</h3>
                            <p>Some content in menu 2.</p>
                        </div>
                    </div>

                </div>

                <div class="col-md-9 col-sm-9">
                    <div class="map" id="map"></div>
                </div>


            </div>

        </div>
        <!-- MENU SECTION END-->





    </div>


    <!-- CONTENT-WRAPPER SECTION END-->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <img src="https://upload.wikimedia.org/wikipedia/th/thumb/1/15/NU_Logo.png/200px-NU_Logo.png" alt="" width="3%">
                    <img src="http://www.cgistln.nu.ac.th/gistweb_2013/images/logo_gistv1.png" alt="" width="10%"> พัฒนาโดย สถานภูมิภาคเทคโนโลยีอวกาศและภูมิสารสนเทศ ภาคเหนือตอนล่าง และมหาวิทยาลัยนเรศวร
                </div>

            </div>
        </div>
    </footer>
    <!-- FOOTER SECTION END-->
    <!-- JAVASCRIPT AT THE BOTTOM TO REDUCE THE LOADING TIME  -->
    <!-- CORE JQUERY SCRIPTS -->
    <!-- BOOTSTRAP SCRIPTS  -->
    <script src="assets/js/bootstrap.js"></script>



</body>
<script src="app.js"></script>


</html>