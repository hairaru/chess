<?php

class Conf {
    
    private static $database = array(
        'hostname' => 'infolimon.iutmontp.univ-montp2.fr',
        'database' => 'aboulincp',
        'login'    => 'aboulincp',
        'password' => '1107003954T'
    );

    static public function getLogin() {
        return self::$database['login'];
    }

    static public function getHostname() {
        return self::$database['hostname'];
    }

    static public function getDatabase() {
        return self::$database['database'];
    }

    static public function getPassword() {
        return self::$database['password'];
    }

}

class Model {

    public static $pdo;

    public static function init_pdo() {
        $host   = Conf::getHostname();
        $dbname = Conf::getDatabase();
        $login  = Conf::getLogin();
        $pass   = Conf::getPassword();
        try {
            // connexion à la base de données            
            // le dernier argument sert à ce que toutes les chaines de charactères 
            // en entrée et sortie de MySql soit dans le codage UTF-8
            self::$pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            // on active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    public static function loadGame($id) {
        try {
            $sql = "SELECT * FROM games WHERE id=:id"; 
            $req_prep = self::$pdo->prepare($sql);
            $values = array("id" => $id);
            $req_prep->execute($values);
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }

    public static function saveGame($id, $object, $time, $info) {
        try {
            //$obj = serialize($object);
            $sql = "INSERT INTO games (id, object, time, info) VALUES (:id, :object, :time, :info)";
            $values = array("id" => $id,
                            "object" => $object,
                            "time" => $time,
                            "info" => $info);
            $req_prep = Model::$pdo->prepare($sql);
            $req_prep->execute($values);
        }
        catch (Exception $e) {
            echo 'Exception reçue : ',  $e->getMessage(), "\n";
        }
    }
}

// on initialise la connexion $pdo
Model::init_pdo();

if ($_GET["action"]=="save") {Model::saveGame($_GET["id"],$_GET["object"],$_GET["time"], $_GET["info"]);}
if ($_GET["action"]=="load") {echo json_encode(Model::loadGame($_GET["id"]));}
