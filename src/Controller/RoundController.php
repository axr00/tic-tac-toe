<?php

/**
 * @author axr 2023
 * @version 1.0
 * @description HomeController.php - define all routes for the start page
 * /home/game/playerID={id}&name={name} -  index render with the given player id & name
 * /home/game/send-results-human/{id} - set & updates the won counter in db for the player
 * /home/game/send-results-ai/{id} - set & updates the lost counter in db for the player
 * /home/game/send-results-tie/{id} - basically just for the tie-game message
 */

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\PlayerRepository;
use App\Entity\Player;

class RoundController extends AbstractController
{
    #[Route('/home/game/playerID={id}&name={name}', name: 'app_game')]
    public function index(int $id, string $name): Response
    {
        $currentID = $id;
        $currentName = $name;
        return $this->render('round/index.html.twig', ['currentID' => $currentID, 'currentName' => $currentName]);
    }

    #[Route('/home/game/send-results-human/{id}', name: 'app_game_results_human')]
    public function sendResultHuman(int $id, PlayerRepository $repository, EntityManagerInterface $entityManager, Request $request): Response
    {
        $repository = $entityManager->getRepository(Player::class);
        $player = $repository->find($id);

        if (!$player) {
            throw $this->createNotFoundException(
                'player with '.$id . 'not found...'
            );
        }

        $gameWonCount = $player->getWon();
        $player->setWon($gameWonCount + 1);
        $entityManager->flush();

        $this->addFlash('success', $player->getName() . ' won the game!');

        return $this->redirectToRoute('app_game', ['id' => $player->getId(), 'name' => $player->getName()]);
    }

    #[Route('/home/game/send-results-ai/{id}', name: 'app_game_results_ai')]
    public function sendResultAI(int $id, PlayerRepository $repository, EntityManagerInterface $entityManager): Response
    {
        $repository = $entityManager->getRepository(Player::class);
        $player = $repository->find($id);

        if (!$player) {
            throw $this->createNotFoundException(
                'player with '.$id . 'not found...'
            );
        }

        $gameLostCount = $player->getLost();
        $player->setLost($gameLostCount + 1);
        $entityManager->flush();

        $this->addFlash('danger', 'You lost the game!');

        return $this->redirectToRoute('app_game', ['id' => $player->getId(), 'name' => $player->getName()]);
    }

    #[Route('/home/game/send-results-tie/{id}', name: 'app_game_results_tie')]
    public function sendResultTie(int $id, PlayerRepository $repository, EntityManagerInterface $entityManager): Response
    {
        $repository = $entityManager->getRepository(Player::class);
        $player = $repository->find($id);

        if (!$player) {
            throw $this->createNotFoundException(
                'player with '.$id . 'not found...'
            );
        }

        $this->addFlash('warning', 'Tie game!');

        return $this->redirectToRoute('app_game', ['id' => $player->getId(), 'name' => $player->getName()]);
    }
}
