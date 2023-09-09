window.onload = async () => {
  const isAuthenticated = await isAuthenticatedUser();
  if (!isAuthenticated) {
    await showAlert({
      message: 'Entrance permitted only to Spartans who have been logged in.',
      alertButtonProperties: { text: 'Understood', href: '/login' },
      isAccessDeniedAlert: true,
      displayDuration: 2,
      delayDisplayDuration: 0.1,
      onClose: () => {
        window.location.href = '/login';
      },
    });

    localStorage.removeItem('jwtAccessToken');
    return updateNavbarAuthState(false);
  }

  updateNavbarAuthState(true);
  unhideElements('tactics-panel');

  const tacticsData = await getData('/tactics/all')
    .then((d) => d.json())
    .catch((e) => console.error(e));

  const tacticsListContainer = document.getElementById('tactics-panel');

  tacticsData?.forEach(({ title, information, image }) => {
    const tacticWrapper = document.createElement('div');
    tacticWrapper.classList.add('tactic-container');

    const tacticTitle = document.createElement('h3');
    tacticTitle.classList.add('tactic-title');
    tacticTitle.textContent = title;
    tacticWrapper.appendChild(tacticTitle);

    const tacticImage = document.createElement('img');
    tacticImage.classList.add('tactic-image');
    tacticImage.src = `data:image/jpeg;base64,${image}`;
    tacticImage.alt = title;
    tacticWrapper.appendChild(tacticImage);

    const tacticDescription = document.createElement('p');
    tacticDescription.classList.add('tactic-text');

    const replacedTacticInformation = addLineBreaksToText(information, 2);
    tacticDescription.textContent = replacedTacticInformation;
    tacticWrapper.appendChild(tacticDescription);

    tacticsListContainer.appendChild(tacticWrapper);
  });
};
