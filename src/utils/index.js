const mapDBToAlbumsModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapDBToGetByIdSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_Id: albumId,
});

const mapDBToGetSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

module.exports = {
  mapDBToAlbumsModel,
  mapDBToGetByIdSongs,
  mapDBToGetSongs,
};
