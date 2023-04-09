<?php

/**
 * @author axr 2023
 * @version 1.0
 * @description HomeController.php - define all routes for the start page
 * /home -  index render & get all players from db
 * /home/create-player - creates the player after submit, persists values in db
 * /home/delete-player/{id} - remove player from db with the given id
 * /home/start-play/{id} - starts the game with the given id
 */

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Player;
use App\Repository\PlayerRepository;
use App\Form\PlayerFormType;

class HomeController extends AbstractController
{
    #[Route('/home', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig',[]);
    }

    #[Route('/home/create-player', name: 'app_home_create')]
    public function createPlayer(Request $request, EntityManagerInterface $entityManager): Response
    {
        $player = new Player();
        $player->setName('');
        $player->setWon(0);
        $player->setLost(0);

        $form = $this->createForm(PlayerFormType::class, $player);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($player);
            $entityManager->flush();
            return $this->redirectToRoute('app_game', ['id' => $player->getId(), 'name' => $player->getName()]);
        }
        
        return $this->render('playerform/index.html.twig', [
            'player_form' => $form->createView(),
        ]);
    }

    #[Route('/home', name: 'app_home')]
    public function showPlayers(PlayerRepository $repository, EntityManagerInterface $entityManager): Response
    {
        $repository = $entityManager->getRepository(Player::class);
        $players = $repository->findAll();
        return $this->render('home/index.html.twig', ['players' => $players]);
    }

    #[Route('/home/delete-player/{id}', name: 'app_home_delete')]
    public function deletePlayer(int $id, PlayerRepository $repository, EntityManagerInterface $entityManager): Response
    {
        $repository = $entityManager->getRepository(Player::class);
        $player = $repository->find($id);

        if (!$player) {
            throw $this->createNotFoundException(
                'player with '.$id . 'not found...'
            );
        }

        $entityManager->remove($player);
        $entityManager->flush();

        return $this->redirectToRoute('app_home');
    }

    #[Route('/home/start-play/{id}', name: 'app_home_play')]
    public function startPlaying(int $id, PlayerRepository $repository, EntityManagerInterface $entityManager): Response
    {
        $repository = $entityManager->getRepository(Player::class);
        $player = $repository->find($id);

        if (!$player) {
            throw $this->createNotFoundException(
                'player with '.$id . 'not found...'
            );
        }

        return $this->redirectToRoute('app_game', ['id' => $player->getId(), 'name' => $player->getName()]);
    }
}
