import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import * as PulpCoreClient from '@app/pulpcore-client';

import RepoListHeader from './RepoListHeader'
import LoadingList from './LoadingList'
import RepoItem from './RepoItem';

const RepoList = () => {
    const [list, setList] = useState<JSX.Element[]>([<LoadingList />]);
    const [listPromise, setListPromise] = useState<Promise<AxiosResponse<PulpCoreClient.PaginatedRepositoryResponseList>>>();

    useEffect(() => {
        const configuration = new PulpCoreClient.Configuration({username: 'admin', password: 'password', basePath: 'http://localhost:9000'});
        const repoAPI = new PulpCoreClient.RepositoriesApi(configuration);
        const tempList = repoAPI.list();
        setListPromise(tempList);
    }, []);

    useEffect(() => {
        if(listPromise) {
            listPromise.then((temp) => {
                if(temp.data.results) {
                    setList(temp.data.results.map((item) =>  {
                        return <RepoItem name={item.name} key={item.name}/>
                    }));
                }
            })
        }
    }, [listPromise]);
    
    return <div>
        <RepoListHeader />
        {list}
    </div>
}

export { RepoList };