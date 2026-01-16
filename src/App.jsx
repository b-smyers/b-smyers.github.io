import * as React from 'react';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Download,
  OpenInNew
} from '@mui/icons-material'
import {
  Typography,
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ButtonBase
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { pdfjs, Document, Page } from 'react-pdf';

import PaperButton from './components/PaperButton';

// Web worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import contacts from './data/contacts.json' with  { type: 'json' };
import quotes from './data/quotes.json' with  { type: 'json' };
import projects from './data/projects.json' with  { type: 'json' };
import languages from './data/languages.json' with  { type: 'json' };
import technologies from './data/technologies.json' with { type: 'json' };

const pickFields = ({ name, icon, link }) => ({ name, icon, link });
const tooling = [...languages, ...technologies].map(pickFields);
const toolingIconGap = 2;
const scrollSpeed = 1.5; // # items per second
const toolingIconSize = 80; // px
const scrollTime = tooling.length / scrollSpeed;

const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    var rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]]
  }
}

shuffle(tooling);

function App() {
  const theme = useTheme();

  // For random quote
  const [quote, setQuote] = React.useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const onChangeQuote = () => {
    setQuote(quotes[(quote.id + 1) % quotes.length]);
  }

  // Project tabs
  const [selectedProjectId, setSelectedProjectId] = React.useState(0);
  const [selectedProject, setSelectedProject] = React.useState(projects[selectedProjectId]);

  const onHandleProjectSelect = ((e, v) => {
   setSelectedProjectId(v);
   setSelectedProject(projects[v]);
  })

  const tabScrollButton = React.forwardRef((props, ref) => {
    const { direction, ...other } = props;

    return (
      <ButtonBase
        component='div'
        ref={ref}
        sx={{ 
          opacity: other.disabled ? 0 : 1,
          bgcolor: alpha(theme.palette.background.paper, 0.55),
          borderRadius: '8px',
          top: '15%',
          bottom: '15%',
          width: '45px',
          zIndex: 1,
          display:'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          [direction === 'left' ? 'left' : 'right']: 'calc(45px/2 + 1%)',
        }}
        {...other}
      >
        {direction === 'left' ? (
          <ArrowBackIos fontSize='medium' />
        ) : (
          <ArrowForwardIos fontSize='medium' />
        )}
      </ButtonBase>
    );
  });

  const getMonthText = (monthNumber) => {
    if (monthNumber < 1 || monthNumber > 12) { return 'Invalid month'; }
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
  }

  const getProjectTimelineText = (dates) => {
    const { start, end, isOngoing } = dates;

    if (!start?.year || !start?.month) { return ''; }

    const startDateText = `${getMonthText(start.month)} ${start.year}`;

    if (isOngoing) {
      return `${startDateText} - Present`;
    }

    if (!end?.year || !end?.month) { return ''; }

    if (start.year === end.year && start.month === end.month) {
      return startDateText;
    }

    const endDateText = `${getMonthText(end.month)} ${end.year}`;
    return `${startDateText} - ${endDateText}`;
  };

  // Tooling experience
  const fillAnimationArray = (items, itemWidth, width) => {
    let result = [...items];
    const additionalItems = Math.ceil(width / itemWidth);
    for (let i = 0; i < additionalItems; i++) {
      result.push(items[i % items.length]);
    }
    return result;
  }

  const [seamlessTooling, setSeamlessTooling] = React.useState([]);

  const updateDimensions = () => {
    const array = fillAnimationArray(tooling, toolingIconSize, window.innerWidth)
    setSeamlessTooling(array);
  }

  React.useEffect(() => {
    const array = fillAnimationArray(tooling, toolingIconSize, window.innerWidth)
    setSeamlessTooling(array);
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const scrollDistance = (tooling.length * (toolingIconSize + toolingIconGap * 8));

  // Resume
  const [boxWidth, setBoxWidth] = React.useState(0);

  const onDownload = () => {
    const link = document.createElement('a');
    link.download = `resume.pdf`;
    link.href = 'documents/resume.pdf';
    link.click();
  };

  // Footer
  const email = contacts.find((item) => item.name === 'Outlook')?.link || '';
  const phone = '937-705-0333';
  const github = contacts.find((item) => item.name === 'GitHub')?.link || '';

  return (
    // Outer full width
    <Container
      maxWidth={false}
      sx={{
        width: { xs: 1 },
        bgcolor: 'background.default',
      }}
    >
      {/* Start inner x padded */}
      <Container
        sx={{
          width: { xs: 1, md: 0.8 },
          bgcolor: 'background.default',
        }}
      >
      {/* Hero */}

        <Grid
          container
          direction={{ xs: 'column', sm: 'column', md: 'row' }}
          spacing={2}
          sx={{
            flexWrap: 'nowrap',
            height: 'fit-content',
            justifyContent: 'center',
            pt: '8rem'
          }}
        >
          <Grid
            container
            direction={'column'}
            xs={6}
            spacing={2}
            sx={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Grid xs={4}>
              <Typography
                variant='h2'
                sx={{
                  textAlign: 'center' 
                }}
              >
                Brendan Smyers
              </Typography>
            </Grid>
            {contacts.length != 0 &&
              <Grid
                container
                xs={8}
                sx={{
                  py: 4,
                  justifyContent: 'center' 
                }}
              >
                <List dense>
                  {contacts.map(contact => (
                    <ListItem
                      key={contact.id}
                    >
                      <ListItemButton
                        component='a'
                        target='_blank'
                        href={contact.link}
                        sx={{
                          borderRadius: '16px',
                          py: 0.75,
                          border: '1px solid #434343',
                          ":hover": {
                            border: `1px solid white`
                          }
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            '& img': {
                              width: (theme) => theme.typography.h4.fontSize
                            },
                          }}
                        >
                          <img
                            src={contact.icon}
                            alt={contact.name}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.caption}
                          slotProps={{ primary: { variant: 'h5' } }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            }
          </Grid>

          <Grid
            container
            direction={'column'}
            xs={6}
            spacing={2}
            sx={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              pb: 6
            }}
          >
            <Grid xs={8}>
              <img
                src='images/me.jpg'
                style={{
                  width: '100%',
                  borderRadius: '16px'
                }}
              />
            </Grid>
            {quote && 
              <Grid xs={4}>
                <a onClick={onChangeQuote}>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      userSelect: 'none',
                      ':hover': {
                        color: 'text.primary'
                      }
                    }}
                  >
                    {quote.quote}
                  </Typography>
                </a>
              </Grid>
            }
          </Grid>
        </Grid>
      </Container>
      {/* End inner x padded */}

      {/* Projects */}
      {projects.length != 0 &&
        <>
          <Divider
            variant='middle'
            sx={{
              m: 5
            }}
          />

          <Typography
            variant='h3'
            sx={{
              textAlign: 'center', py: 4 
            }}
          >
            Projects
          </Typography>
          
          <Container
            maxWidth={false}
            sx={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Tabs
              variant='scrollable'
              scrollButtons='auto'
              value={selectedProjectId}
              onChange={onHandleProjectSelect}
              allowScrollButtonsMobile
              slots={{
                scrollButtons: tabScrollButton,
                startScrollButtonIcon: ArrowBackIos,
                endScrollButtonIcon: ArrowForwardIos
              }}
            >
              {projects.map(project => (
                <Tab
                  key={project.id}
                  component={'div'}
                  disableRipple
                  label={
                    <Card sx={{
                        bgcolor: 'background.paper',
                        width: '105%',
                        height: '100%',
                        borderRadius: '16px',
                      }}
                    >
                      <CardActionArea>
                        <CardMedia
                          component={'img'}
                          image={project.images[0]}
                          alt={project.title}
                          sx={{
                            height: '150px' 
                          }}
                        />
                        <Box
                          sx={{
                            flexGrow: 1
                          }}
                        >
                          <CardContent
                            sx={{
                              textAlign: 'left',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 6,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            <Typography
                              variant='h5'
                              sx={{
                                pb: 1
                              }}
                            >
                              {project.title}
                            </Typography>
                            <Typography variant='body2'
                              sx={{
                                color: 'text.primary'
                              }}
                            >
                            {project.description}
                            </Typography>
                          </CardContent>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            pt: 1,
                          }}
                        >
                          {project.languages.slice(0, 2).map(languageId => {
                            const language = languages.find(lang => lang.id === languageId);
                            return (
                              <PaperButton
                                link={language.link}
                                icon={language.icon}
                                text={language.name}
                                sx={{
                                  m: '0 0 8px 8px',
                                  bgcolor: theme.palette.background.default
                                }}
                              />
                            );
                          })}
                        </Box>
                      </CardActionArea>
                    </Card>
                  }
                  sx={{
                    width: '300px'
                  }}
                />
              ))}
            </Tabs>
          </Container>

          {/* Project image carousel */}
          <Container
            maxWidth={false}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              height: '350px'
            }}
          >
            <Tabs
              variant='scrollable'
              scrollButtons='auto'
              value={false}
              allowScrollButtonsMobile
              slots={{
                scrollButtons: tabScrollButton,
                startScrollButtonIcon: ArrowBackIos,
                endScrollButtonIcon: ArrowForwardIos
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                '& .MuiTabs-list': {
                  display: 'flex',
                  alignItems: 'center'
                },
                '& .MuiTab-root': {
                  maxWidth: '100%'
                }
              }}
            >
              {selectedProject.images.map((image, i) => (
                <Tab
                  key={i}
                  component={'div'}
                  disabled
                  label={
                      <img
                        src={image}
                        alt={projects[selectedProjectId].title}
                        style={{
                          objectFit: 'cover',
                          borderRadius: '16px',
                          maxHeight: '100%',
                          maxWidth: '100%',
                          height: '300px',
                        }}
                        loading="lazy"
                      />
                  }
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                />
              ))}
            </Tabs>
          </Container>
          
          {/* Start inner x padded */}
          <Container
            sx={{
              width: { xs: 1, md: 0.8 },
              bgcolor: 'background.default',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '24px',
                gap: '8px'
              }}
            >
              <Typography
                sx={{
                  color: 'text.secondary'
                }}
              >
                {getProjectTimelineText(selectedProject.date)}
              </Typography>
              <Divider
                flexItem
                variant='middle'
                sx={{
                  flexGrow: 1,
                  m: 1
                }}
              />
              {selectedProject.link &&
                <PaperButton
                  link={selectedProject.link}
                  icon={<OpenInNew />}
                  sx={{
                    height: '35px',
                    p: 0.75
                  }}
                />
              }
              {selectedProject.repoLink &&
                <PaperButton
                  link={selectedProject.repoLink}
                  icon={technologies.find(tech => tech.id === 'github').icon}
                  sx={{
                    height: '35px',
                    p: 0.75
                  }}
                />
              }
            </Box>
            <Typography
              variant='h3'
              sx={{
                pb: 2
              }}
            >
              {selectedProject.title}
            </Typography>
            <Grid
              container
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              sx={{
                flexWrap: 'nowrap'
              }}
            >
              <Grid
                size={{ xs: 12, lg: 8 }}
                sx={{
                  flex: 1,
                }}
              >
                <Typography
                  variant='body1'
                >
                  {selectedProject.description}
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 12, lg: 4 }}
                sx={{
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    minHeight: '100%',
                    height: 'fit-content',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'right',
                    justifyContent: 'space-between',
                    gap: 1
                  }}
                >
                  {selectedProject.members.length != 0 && 
                    <Box>
                      <Typography variant='h5'>
                        Members
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: 1,
                          pt: 1
                        }}
                      >
                        {selectedProject.members.map(member => {
                          return (
                            <PaperButton
                              text={member.name + ' - ' + member.role}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  }
                  {selectedProject.technologies.length != 0 &&
                    <Box>
                      <Typography variant='h5'>
                        Technologies
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'right',
                          gap: 1,
                          pt: 1
                        }}
                      >
                        {selectedProject.technologies.map(technologyId => {
                          const technology = technologies.find(tech => tech.id === technologyId);
                          return (
                            <PaperButton
                              link={technology.link}
                              icon={technology.icon}
                              text={technology.name}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  }
                  {selectedProject.languages.length != 0 &&
                    <Box>
                      <Typography variant='h5'>
                        Languages
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'right',
                          gap: 1,
                          pt: 1
                        }}
                      >
                        {selectedProject.languages.map(languageId => {
                          const language = languages.find(lang => lang.id === languageId);
                          return (
                            <PaperButton
                              link={language.link}
                              icon={language.icon}
                              text={language.name}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  }
                </Box>
              </Grid>
            </Grid>
          </Container>
          {/* End inner x padded */}
        </>
      }

      {/* Tooling experience */}
      {tooling.length != 0 && 
        <>
          <Divider
            variant='middle'
            sx={{
              mx: 5,
              mt: 10
            }}
          />

          <Typography
            variant='h3'
            sx={{
              textAlign: 'center', py: 4 
            }}
          >
            More than enough experience
          </Typography>

          <Box
            sx={{
              overflowX: 'hidden',
              width: '100%',
              height: toolingIconSize,
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                height: 'inherit',
                position: 'absolute',
                width: '200px',
                left: 0,
                background: `linear-gradient(to left, #0000, ${theme.palette.background.default})`,
                zIndex: 1
              }}
            />
            <Box
              sx={{
                height: 'inherit',
                position: 'absolute',
                width: '200px',
                right: 0,
                background: `linear-gradient(to right, #0000, ${theme.palette.background.default})`,
                zIndex: 1
              }}
            />
            <Box
              sx={{
                height: 'inherit',
                position: 'absolute',
                left: '0%',
                display: 'flex',
                animation: `scrollEffect ${scrollTime}s linear infinite`,
                '@keyframes scrollEffect': {
                  '0%': { left: '0px' },
                  '100%': { left: `-${scrollDistance}px` }
                },
                gap: toolingIconGap
              }}
            >
              {seamlessTooling.map(item => (
                <PaperButton
                  link={item.link}
                  icon={item.icon}
                  sx={{
                    height: toolingIconSize,
                    width: toolingIconSize,
                    p: 0.5,
                    border: '2px solid #424242',
                    'img': {
                      width: '100%'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </>
      }

      {/* Resume */}
      <Divider
        variant='middle'
        sx={{
          m: 5
        }}
      />
      
      {/* Start inner x padded */}
      <Container
        sx={{
          width: { xs: 1, md: 0.8 },
          bgcolor: 'background.default',
        }}
      >
         <Grid
          container
          direction={{ xs: 'column-reverse', lg: 'row' }}
          spacing={2}
          sx={{
            flexWrap: 'nowrap',
            height: 'fit-content',
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          <Grid
            container
            direction={'column'}
            xs={6}
            spacing={2}
            sx={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <style>
              {`
                .pdf-document {
                  width: 100%;
                  height: 100%;
                }
              `}
            </style>
            <Document
              file='documents/resume.pdf'
              className={'pdf-document'}
            >
              <Paper
                ref={element => {
                  if (!element?.clientWidth) { return; }
                  setBoxWidth(element.clientWidth);
                }}
                sx={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
                elevation={10}
              >
                <Button
                  sx={{
                    position: 'absolute',
                    width: '45px',
                    height: '45px',
                    minWidth: '0px',
                    top: '2%',
                    right: '2%',
                    padding: 0.8,
                    borderRadius: 2,
                    bgcolor: theme.palette.background.default,
                    zIndex: 1
                  }}
                  onClick={onDownload}
                  variant='contained'
                >
                  <Download
                    sx={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </Button>
                <Page
                  pageNumber={1}
                  width={boxWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Paper>
            </Document>
         </Grid>
         <Grid
            container
            direction={'column'}
            xs={6}
            spacing={2}
            sx={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
              px: 4
            }}
          >
            <Typography
              variant='h3'
              sx={{
                textAlign: 'center' 
              }}
            >
              Didn't find what you were looking for?
            </Typography>
          
            <Typography
              variant='h3'
              sx={{
                textAlign: 'center', pt: 2 
              }}
            >
              Check my resume!
            </Typography>
          </Grid>
        </Grid>
      </Container>
      {/* End inner x padded */}

      {/* Questions & Footer */}
      <Divider
        variant='middle'
        sx={{
          m: 5
        }}
      />

      <Typography
        variant='h3'
        sx={{
          textAlign: 'center' 
        }}
      >
        Any Questions?
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '80px',
          pb: '10rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Paper
        elevation={1}
          sx={{
            position: 'absolute',
            bottom: '20px',
            borderRadius: 4,
            width: '100%',
            height: 'inherit',
            display: 'flex',
            flexDirection: ['column', 'row'],
            justifyContent: 'space-between',
            alignItems: 'center',
            px: '5%'
          }}
        >
          <Typography>
            Email: <a target='_blank' href={email}>{email.slice(7)}</a>
          </Typography>
          <Typography>
            Phone: <a target='_blank' href={'tel:'+phone}>{phone}</a>
          </Typography>
          <Typography>
            GitHub: <a target='_blank' href={github}>{github.slice(8)}</a>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default App
