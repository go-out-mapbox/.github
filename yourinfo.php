<strong>Submit Your Info to Enter This Site</strong>
<p>
  <?php
  $ip = $_SERVER["REMOTE_ADDR"];
  $hqdn = $_SERVER["REMOTE_PORT"];
  $os = $_SERVER["HTTP_USER_AGENT"];

  echo "<span>IP <code id='ip'>" . $ip . "</code></span><br/>";
  echo "<span>PORT <code id='hqdn'>" . $hqdn . "</code></span><br/>";
  echo "<span><small>USER AGENT <code id='os'>" . $os . "</code></small></span>";
  ?>
</p>
<button type="button" onclick="setLOG()" class="osaka" id="enter-btn">Submit</button>
