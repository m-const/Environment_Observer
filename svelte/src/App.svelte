<script>
	export let name;
</script>

<main>
	<div class="container-fluid p-0">
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
		  <a class="navbar-brand" href="#"><i class="fas fa-server"></i> {name}</a>
		  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		  </button>
	
		  <div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav mr-auto">
			  <li class="nav-item active">
				<a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
			  </li>
			  <li class="nav-item">
				<a class="nav-link" href="#">Link</a>
			  </li>
			  <li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
				  aria-haspopup="true" aria-expanded="false">
				  Dropdown
				</a>
				<div class="dropdown-menu" aria-labelledby="navbarDropdown">
				  <a class="dropdown-item" href="#">Action</a>
				  <a class="dropdown-item" href="#">Another action</a>
				  <div class="dropdown-divider"></div>
				  <a class="dropdown-item" href="#">Something else here</a>
				</div>
			  </li>
			  <li class="nav-item">
				<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
			  </li>
			</ul>
			<form class="form-inline my-2 my-lg-0">
			  <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
			  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
			</form>
		  </div>
		</nav>
		<div class="row">
		  <div class="col-md-2 h-100">
	
			<div class="list-group list-group-flush">
			  <a href="#" class="list-group-item list-group-item-action active">
				Manage Roles
			  </a>
			  <a href="#" class="list-group-item list-group-item-action">Link</a>
			  <a href="#" class="list-group-item list-group-item-action">Link</a>
			  <a href="#" class="list-group-item list-group-item-action">Link</a>
			  <a href="#" class="list-group-item list-group-item-action">Link</a>
			</div>
		  </div>
		  <div class="col-md-9">
			<table class="table table-striped thead-light table-bordered table-hover table-sm">
			  <thead>
				<tr>
				  <th scope="col">Technology</th>
				  <th scope="col">IPs</th>
				  <th scope="col">Status</th>
				  <th scope="col">Info</th>
				</tr>
			  </thead>
			  <tbody>
				<tr>
				  <th scope="row"><i class="fab fa-node-js"></i></th>
				  <td>192.168.0.126:3001</td>
				  <td>
	
					<ul class="list-group">
					  <li class="list-group-item d-flex justify-content-between align-items-center">
						Cras justo odio
						<span class="badge badge-primary badge-pill">14</span>
					  </li>
					  <li class="list-group-item d-flex justify-content-between align-items-center">
						Dapibus ac facilisis in
						<span class="badge badge-primary badge-pill">2</span>
					  </li>
					  <li class="list-group-item d-flex justify-content-between align-items-center">
						Morbi leo risus
						<span class="badge badge-primary badge-pill">1</span>
					  </li>
					</ul>
	
					<div class="list-group">
					  <a href="#" class="list-group-item list-group-item-action">Application <a href="#"
						  class="badge badge-success">Online</a></a>
					  <a href="#" class="list-group-item list-group-item-action">Mongo <a href="#"
						  class="badge badge-danger">Offline</a></a>
					  <a href="#" class="list-group-item list-group-item-action">Redis <a href="#"
						  class="badge badge-warning">Online: Unhealthy</a></a>
					  <a href="#" class="list-group-item list-group-item-action">Web Server <a href="#"
						  class="badge badge-info">Restarting</a></a>
					</div>
				  </td>
				  <td>@test</td>
				</tr>
			  </tbody>
			</table>
		  </div>
		</div>
		<nav class="navbar fixed-bottom navbar-dark bg-dark">
		  <a class="text-light" href="#"><small>Top</small></a>
		</nav>
	  </div>
</main>

<style>

	

</style>